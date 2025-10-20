import React, { useState } from 'react';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import { PhotoIcon, ArrowUpOnSquareIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AlertLevel, PostCategory } from '../types';

const Notifications: React.FC = () => {
  const [topic, setTopic] = useState('Weather Alert');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [targetUser, setTargetUser] = useState('');
  
  // State for the new post form
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [postDescription, setPostDescription] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postAlertLevel, setPostAlertLevel] = useState<AlertLevel>(AlertLevel.Info);
  const [postCategory, setPostCategory] = useState<PostCategory>(PostCategory.Official);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would dispatch to an API
    console.log({
      topic,
      description,
      location,
      targetUser: targetUser || 'All Users in Location',
    });
    alert('Notification sent! (Check console for details)');
    // Reset form
    setDescription('');
    setLocation('');
    setTargetUser('');
  };
  
  // Handlers for the new post form
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPostImage(null);
    setPostImagePreview(null);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postImage) {
      alert('Please upload an image for the post.');
      return;
    }
    // In a real app, this would be a new Post object sent to an API
    console.log({
      image: postImage.name,
      description: postDescription,
      location: postLocation,
      alertLevel: postAlertLevel,
      category: postCategory,
    });
    alert('Post created successfully! (Check console for details)');
    // Reset form
    handleRemoveImage();
    setPostDescription('');
    setPostLocation('');
    setPostAlertLevel(AlertLevel.Info);
    setPostCategory(PostCategory.Official);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Send New Notification</h2>
        <p className="mb-6 text-gray-600">
          This interface allows administrators to send targeted push notifications to mobile app users.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Notification Topic
            </label>
            <select
              id="topic"
              name="topic"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option>Weather Alert</option>
              <option>Map Updates</option>
              <option>General Announcement</option>
              <option>Safety Information</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
              placeholder="Enter the main body of the notification..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Target Location / Region
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
                placeholder="e.g., Chennai, Mumbai Coast, etc."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Target Username (Optional)
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
                placeholder="Leave blank to target all users in location"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center justify-center bg-incois-red hover:bg-incois-red-dark text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              <BellAlertIcon className="h-5 w-5 mr-2" />
              Send Notification
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Official Post</h2>
        <p className="mb-6 text-gray-600">
            Craft and publish official announcements, alerts, or information as a verified post.
        </p>
        <form onSubmit={handlePostSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {postImagePreview ? (
                        <div className="relative">
                            <img src={postImagePreview} alt="Post preview" className="w-full h-auto object-cover rounded-lg shadow-inner aspect-square" />
                            <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-colors" aria-label="Remove image">
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div> 
                    )}
                </div>
                
                <div className="space-y-4 flex flex-col">
                    <div>
                        <label htmlFor="post-description" className="block text-sm font-medium text-gray-700 mb-1">
                            Caption
                        </label>
                        <textarea
                            id="post-description"
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
                            placeholder="Write a caption..."
                            value={postDescription}
                            onChange={(e) => setPostDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="post-location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="post-location"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
                            placeholder="e.g., Marina Beach, Chennai"
                            value={postLocation}
                            onChange={(e) => setPostLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="post-alert" className="block text-sm font-medium text-gray-700 mb-1">
                                Alert Level
                            </label>
                            <select
                                id="post-alert"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
                                value={postAlertLevel}
                                onChange={(e) => setPostAlertLevel(e.target.value as AlertLevel)}
                            >
                                {Object.values(AlertLevel).map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="post-category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="post-category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-incois-red"
                                value={postCategory}
                                onChange={(e) => setPostCategory(e.target.value as PostCategory)}
                            >
                                {Object.values(PostCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 flex-grow items-end">
                        <button
                            type="submit"
                            className="flex items-center justify-center bg-incois-red hover:bg-incois-red-dark text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={!postImage}
                        >
                            <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
                            Publish Post
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    </div>
  );
};

export default Notifications;