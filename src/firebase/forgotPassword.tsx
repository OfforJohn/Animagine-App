async function handleForgotPassword(email: string) {
  const res = await fetch("/api/send-reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Password reset email sent!");
  } else {
    alert(data.error || "Something went wrong");
  }
}
