import React, { useState } from "react";
import { Avatar } from "antd";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RecipeHeader = ({ recipeTitle, recipeImage, authorInfo }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative">
      <img
        src={recipeImage}
        alt={recipeTitle}
        className="w-full h-[400px] object-cover"
      />
      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-white/90 transition"
        >
          <ArrowLeft className="w-6 h-6 text-olive-800" />
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`bg-white/70 backdrop-blur-sm p-2 rounded-full transition ${
              liked ? "text-red-500" : "text-olive-800"
            }`}
          >
            <Heart className="w-6 h-6" fill={liked ? "currentColor" : "none"} />
          </button>
          <button className="bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-white/90 transition">
            <Share2 className="w-6 h-6 text-olive-800" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h1 className="text-4xl font-bold text-olive-900 tracking-tight">
          {recipeTitle}
        </h1>
        <div className="flex items-center mt-4 space-x-3">
          <Avatar
            src={authorInfo?.ProfilePicURL || "/src/assets/logo.png"}
            alt={authorInfo?.name || "Foodigo Team"}
            className="border-2 border-[#5d6544] shadow-sm shadow-olive"
            size={50}
          />
          <p className="text-olive-800 font-semibold">
            {authorInfo?.name || "Foodigo Team"}
          </p>
        </div>
      </div>
    </div>
  );
};
