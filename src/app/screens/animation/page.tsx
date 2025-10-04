"use client";
import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { db, auth } from "@/firebase/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    Timestamp,
    onSnapshot,
    setLogLevel,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { supabase } from "@/lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
    id: string;
    title: string;
    date: string;
    thumbnailUrl?: string;
}

const CardLayout: React.FC = () => {
    const [title, setTitle] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
        null
    );

    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const today = new Date().toLocaleDateString();

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");

    const router = useRouter();

    // sample prompts
    const samplePrompts = [
        "Anime hero with blue hair",
        "Cyberpunk soldier with neon lights",
        "Fantasy elf archer",
        "Cartoon style cat with armor",
    ];

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);

                const q = query(collection(db, "projects"), where("userId", "==", user.uid));
                const unsubscribeFirestore = onSnapshot(
                    q,
                    (snapshot) => {
                        const projectsData: Project[] = [];
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            projectsData.push({
                                id: doc.id,
                                title: data.title,
                                date: data.date,
                                thumbnailUrl: data.thumbnailUrl,
                            });
                        });
                        setProjects(projectsData);
                        setError(null);
                    },
                    (err) => {
                        console.error("Firestore listener error:", err);
                        setError("Failed to load projects.");
                    }
                );

                return () => unsubscribeFirestore();
            } else {
                setUserId(null);
                setProjects([]);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const handleDeleteProject = async (projectId: string) => {
        try {
            await deleteDoc(doc(db, "projects", projectId));
            setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
            toast.success("Project deleted!");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete project.");
        }
    };

    // Horde API Call
    const generateCharacter = async () => {
        if (!prompt.trim()) {
            toast.error("Enter a prompt first!");
            return;
        }

        setLoading(true);
        setGeneratedImage(null);

        try {
            // 1. Start generation
            const response = await fetch("https://stablehorde.net/api/v2/generate/async", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": "0000000000", // ⚡ replace with your Horde API key
                },
                body: JSON.stringify({
                    prompt,
                    params: {
                        sampler_name: "k_lms",
                        cfg_scale: 7.5,
                        width: 512,
                        height: 512,
                        steps: 20,
                        n: 1,
                    },
                    nsfw: false,
                    censor_nsfw: true,
                }),
            });

            const data = await response.json();
            if (!data.id) throw new Error("Failed to start generation");

            // 2. Poll for status
            let finished = false;
            let imgResult: string | null = null;

            while (!finished) {
                const poll = await fetch(
                    `https://stablehorde.net/api/v2/generate/status/${data.id}`
                );
                const pollData = await poll.json();

                if (pollData.done && pollData.generations?.length > 0) {
                    const img = pollData.generations[0].img;

                    // Some workers return base64, some return URL
                    if (img.startsWith("http")) {
                        const imgRes = await fetch(img);
                        const blob = await imgRes.blob();
                        const reader = new FileReader();
                        imgResult = await new Promise<string>((resolve) => {
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        });
                    } else {
                        imgResult = `data:image/png;base64,${img}`;
                    }

                    finished = true;
                } else {
                    await new Promise((res) => setTimeout(res, 5000)); // wait 5s
                }
            }

            if (imgResult) {
                setGeneratedImage(imgResult);
                toast.success("✅ Character generated!");
            }
        } catch (err) {
            console.error("Horde error:", err);
            toast.error("❌ Failed to generate character");
        } finally {
            setLoading(false);
        }
    };


    // Save to Firestore + Supabase
    const saveProject = async () => {
        if (!title.trim() || !userId || !generatedImage) {
            toast.error("Please enter title and generate an image first.");
            return;
        }

        setLoading(true);

        try {
            // convert base64 to Blob
            const res = await fetch(generatedImage);
            const blob = await res.blob();

            const fileName = `${Date.now()}_${title}.png`;
            const filePath = `characters/${userId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("test")
                .upload(filePath, blob);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("test").getPublicUrl(filePath);
            const thumbnailUrl = urlData?.publicUrl ?? "";

            await addDoc(collection(db, "projects"), {
                title: title.trim(),
                date: today,
                userId,
                thumbnailUrl,
                createdAt: Timestamp.now(),
            });

            setTitle("");
            setPrompt("");
            setGeneratedImage(null);
            toast.success("Project saved!");
        } catch (err) {
            console.error("Save failed:", err);
            toast.error("Failed to save project.");
        } finally {
            setLoading(false);
        }
    };

    setLogLevel("debug");

    return (
        <ProtectedRoute>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="w-full max-w-[1000px] min-h-[600px] border-2 border-black rounded-lg shadow-lg p-6 bg-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/">
                            <h2 className="text-lg font-medium cursor-pointer hover:underline">
                                Home
                            </h2>
                        </Link>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <Settings className="w-6 h-6" />
                        </button>
                    </div>

                    {/* New Project */}
                    <h3 className="text-xl font-semibold mb-3">New Character Project</h3>
                    <div className="p-4 sm:p-8 border rounded-md bg-gray-300 mb-8">
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Enter project title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />

                            <textarea
                                placeholder="Enter a character prompt..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />

                            {/* Sample prompts */}
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPrompt(p)}
                                        className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={generateCharacter}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-max"
                                disabled={loading}
                            >
                                {loading ? "Generating..." : "Generate Character"}
                            </button>

                            {generatedImage && (
                                <div className="mt-4">
                                    <img
                                        src={generatedImage}
                                        alt="Generated character"
                                        className="w-64 h-64 object-cover rounded border"
                                    />
                                </div>
                            )}

                            {generatedImage && (
                                <button
                                    onClick={saveProject}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-max mt-4"
                                    disabled={loading}
                                >
                                    Save Project
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Previous Projects */}
                    <h3 className="text-xl font-semibold mb-3">Previous Characters</h3>
                    {projects.length === 0 ? (
                        <p className="text-gray-600">No projects found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={`p-4 border rounded-md bg-gray-300 flex flex-col items-center ${deletingProjectId === project.id ? "animate-shake-fade-out" : ""
                                        }`}
                                    onClick={() => router.push("/Cadera")}
                                   
                                >
                                    {project.thumbnailUrl ? (
                                        <img
                                            src={project.thumbnailUrl}
                                            alt="Thumbnail"
                                            className="w-full h-40 object-cover rounded mb-2"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-400 rounded flex items-center justify-center text-gray-600">
                                            No Thumbnail
                                        </div>
                                    )}
                                    <p className="font-medium">{project.title}</p>
                                    <p className="text-sm text-black">{project.date}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toast(
                                                ({ closeToast }) => (
                                                    <div className="flex flex-col gap-2">
                                                        <p>Are you sure you want to delete <b>{project.title}</b>?</p>
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <button
                                                                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                                                onClick={() => closeToast && closeToast()}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                                onClick={() => {
                                                                    closeToast && closeToast();
                                                                    handleDeleteProject(project.id);
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ),
                                                {
                                                    autoClose: false,
                                                    closeOnClick: false,
                                                    draggable: false,
                                                }
                                            );
                                        }}
                                        className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold text-red-700 bg-red-300 rounded hover:bg-red-200 transition-colors duration-200"
                                    >
                                        🗑️
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default CardLayout;
