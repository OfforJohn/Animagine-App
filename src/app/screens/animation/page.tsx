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
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { supabase } from "@/lib/supabaseClient"; // ⬅️ import Supabase client
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";




interface Project {
    id: string;
    title: string;
    date: string;
    thumbnailUrl?: string;
}

const CardLayout: React.FC = () => {
    const [title, setTitle] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    

    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const today = new Date().toLocaleDateString();

    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("✅ Auth UID:", `"${user.uid}"`);
                setUserId(user.uid);

                const q = query(collection(db, "projects"), where("userId", "==", user.uid));
                const unsubscribeFirestore = onSnapshot(
                    q,
                    (snapshot) => {
                        console.log("📦 Fetched docs:", snapshot.docs.length);
                        const projectsData: Project[] = [];

                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            console.log("🎯 Doc userId:", `"${data.userId}"`, "Title:", data.title);
                            projectsData.push({
                                id: doc.id,
                                title: data.title,
                                date: data.date,
                                thumbnailUrl: data.thumbnailUrl,
                            });
                        });

                        setProjects(projectsData);  // <-- Set the newly created array here
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
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to delete this project?</p>
                    <div className="flex justify-end gap-2 mt-10">
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
                                triggerDeleteAnimation(projectId);
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
    };

    const triggerDeleteAnimation = (projectId: string) => {
        setDeletingProjectId(projectId);
    };

    const onAnimationEnd = async (projectId: string) => {
        try {
            await deleteDoc(doc(db, "projects", projectId));
            setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
            toast.success("Project deleted!");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete project.");
        }
        setDeletingProjectId(null);
    };




    setLogLevel("debug");

    const handleCreateProject = async () => {
        if (!title.trim() || !userId) {
            setError("Please enter a project title.");
            toast.error("Please enter a project title.");
            return;
        }

        setLoading(true);
        setError(null);

        toast.success("✅ Project created successfully!");
                router.push("/Cadera");

        try {
            let thumbnailUrl = "";

            if (thumbnailFile) {
                const fileName = `${Date.now()}_${thumbnailFile.name}`;
                const filePath = `test/${userId}/${fileName}`;

                const { data, error: uploadError } = await supabase.storage
                    .from("test")
                    .upload(filePath, thumbnailFile);

                if (uploadError) {
                    console.error("Supabase upload error:", uploadError);
                    throw new Error("Failed to upload thumbnail");
                }

                const { data: urlData } = supabase.storage
                    .from("test")
                    .getPublicUrl(filePath);

                thumbnailUrl = urlData?.publicUrl ?? "";
            }

            await addDoc(collection(db, "projects"), {
                title: title.trim(),
                date: today,
                userId,
                thumbnailUrl,
                createdAt: Timestamp.now(),
            });

            setTitle("");
            setThumbnailFile(null);
        } catch (err) {
            console.error("Error creating project:", err);
            setError("Failed to create project. Please try again.");
            toast.error("❌ Failed to create project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="w-full max-w-[1000px] min-h-[600px] sm:min-h-[750px] md:min-h-[700px] border-2 border-black rounded-lg shadow-lg p-6 bg-gray-200 flex flex-col">
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
                    <h3 className="text-xl font-semibold mb-3">New Project</h3>
                    <div className="p-4 sm:p-8 border rounded-md bg-gray-300 mb-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <p className="font-medium whitespace-nowrap">Animation Title:</p>
                                <input
                                    type="text"
                                    placeholder="Enter animation title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="flex-1 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <p className="font-medium whitespace-nowrap">Thumbnail:</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setThumbnailFile(e.target.files[0]);
                                        }
                                    }}
                                    disabled={loading}
                                />
                            </div>

                            <p className="text-sm text-black">Date: {today}</p>

                            <button
                                onClick={handleCreateProject}
                                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-max ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Project"}
                            </button>
                            {error && <p className="text-red-600 mt-2">{error}</p>}
                        </div>
                    </div>

                    {/* Previous Projects */}
                    <h3 className="text-xl font-semibold mb-3">Previous Animations</h3>
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
                                    onAnimationEnd={() =>
                                        deletingProjectId === project.id && onAnimationEnd(project.id)
                                    }
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
    e.stopPropagation(); // 👈 Prevent parent click
    handleDeleteProject(project.id);
  }}
  className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold text-red-700 bg-red-300 rounded hover:bg-red-200 transition-colors duration-200"
>
  <span role="img" aria-label="trash">🗑️</span>
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
