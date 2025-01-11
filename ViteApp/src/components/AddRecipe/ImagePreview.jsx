import { useState } from "react";
import { Image as LucideImage, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImagePreview = ({ imagePreview, handleImageUpload, removeImage }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="recipe-image-upload"
        />

        {!imagePreview ? (
          <label
            htmlFor="recipe-image-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-olive/30 rounded-lg cursor-pointer transition-all duration-300 hover:bg-olive/5 group"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-3">
              <Upload className="w-12 h-12 text-olive mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </label>
        ) : (
          <div
            className="relative rounded-lg overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.img
              src={imagePreview}
              alt="Recipe preview"
              className="w-full h-64 object-cover rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center space-x-4"
                >
                  <label
                    htmlFor="recipe-image-upload"
                    className="flex items-center px-4 py-2 bg-white/90 rounded-full cursor-pointer hover:bg-white transition-colors"
                  >
                    <LucideImage className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Change Image</span>
                  </label>

                  <button
                    onClick={removeImage}
                    className="flex items-center px-4 py-2 bg-red-500/90 text-white rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Remove</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
