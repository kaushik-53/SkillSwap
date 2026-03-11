# SkillSwap 🤝

SkillSwap is a premium, community-driven platform where neighbors can exchange skills directly—no money needed. Swap a coding lesson for a yoga session, or a gardening tip for a home-cooked meal.


## ✨ Features

- **Dual-Confirmation Swaps:** Both parties must mark a session as complete before it's finalized.
- **Requester-Only Reviews:** Only the person who requested the skill can leave a review, ensuring trust and authenticity.
- **Secure Authentication:** Email OTP verification, Google OAuth, and secure password hashing.
- **Dynamic Profiles:** Track your swaps, ratings, and skills in a beautiful, responsive interface.
- **Cloud Storage:** User avatars are stored permanently using Cloudinary.
- **Modern Tech Stack:** Built with React 18, Node.js, Express, and MongoDB.

## 🚀 Deployment

This project is configured for a split deployment:
- **Frontend:** Hosted on [Vercel](https://vercel.com)
- **Backend:** Hosted on [Render](https://render.com)

### Quick Start (Local Development)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/kaushik-53/SkillSwap.git
   cd SkillSwap
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Fill in your MONGO_URI, JWT_SECRET, etc.
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Set VITE_API_URL=http://localhost:5000
   npm run dev
   ```

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (optional), Lucide Icons, Axios.
- **Backend:** Node.js, Express, Mongoose, Multer, Cloudinary, BcryptJS, JWT.
- **Database:** MongoDB Atlas.

## 📄 License

This project is private and for demonstration purposes.

---

## 🎨 Changing your URL

If you want a prettier URL (like `skillswap-kaushik.vercel.app`):
1.  **On Vercel:** Go to **Project Settings > Domains**. You can edit the `.vercel.app` subdomain or add a custom domain (like `.com`).
2.  **On Render:** Update the `CLIENT_URL` environment variable to match your new frontend URL.
3.  **On Google Console:** Update the **Authorized JavaScript origins** and **Redirect URIs** to match the new URL.
