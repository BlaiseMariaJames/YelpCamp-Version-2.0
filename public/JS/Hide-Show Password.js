const togglePasswords = document.querySelectorAll('.togglePassword');

for (let togglePassword of togglePasswords) {
    togglePassword.addEventListener("click", function (clickEvent) {
        togglePassword.src = (togglePassword.src.includes("tlfffxqqdvndsjnmk9o0.jpg"))
            ? "https://res.cloudinary.com/dtwgxcqkr/image/upload/v1701142131/YelpCamp%20Related%20Media/zkvg4rxknhwuebgnmd6v.jpg"
            : "https://res.cloudinary.com/dtwgxcqkr/image/upload/v1701142136/YelpCamp%20Related%20Media/tlfffxqqdvndsjnmk9o0.jpg";
        const password = togglePassword.parentElement.children[1];
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
    });
}