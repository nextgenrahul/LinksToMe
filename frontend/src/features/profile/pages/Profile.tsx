'use client';

import React from 'react';

export default function Profile() {
  return (
      <main className="border-x border-gray-800 max-w-2xl">
        {/* Profile Header */}
        <div className="relative">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-b from-blue-900 to-blue-800 relative flex items-center justify-center">
            <h1 className="text-5xl font-semibold text-white/30 tracking-wider">Rahul shakya</h1>
          </div>

          {/* Profile Picture */}
          <div className="absolute left-8 top-30">
            <div className="w-32 h-32 bg-gray-700 rounded-full border-4 border-black flex items-center justify-center">
              <span className="text-5xl">👤</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Rahul Shakya
                  <span className="text-blue-500">✔</span>
                </h2>
                <p className="text-gray-500 text-lg">@nextgenrahul</p>
              </div>
              <button className="border border-gray-600 hover:bg-gray-900 px-6 py-2 rounded-full font-semibold transition">
                Edit profile
              </button>
            </div>

            <p className="mt-4 text-lg">
              Full-Stack Developer | MERN & LAMP | SaaS & GenAI | Next.js | Python | JavaScript
            </p>
            <p className="mt-2 text-lg">
              Creating scalable products & real-world insights 📩 DM for queries
            </p>

            <div className="flex gap-6 mt-4 text-gray-500">
              <span>📍 Fatehabad</span>
              <span>Joined February 2023</span>
            </div>

            <div className="flex gap-6 mt-4">
              <span><strong className="text-white">39</strong> Following</span>
              <span><strong className="text-white">1</strong> Follower</span>
            </div>

            <a href="#" className="text-blue-500 mt-4 inline-block">Get verified</a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {['Posts', 'Replies', 'Highlights', 'Articles', 'Media', 'Likes'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-4 text-center hover:bg-gray-900 transition ${
                tab === 'Posts' ? 'border-b-4 border-blue-500 font-bold' : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Post */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <strong>Rahul Shakya</strong>
                <span className="text-gray-500">@nextgenrahul · Nov 9, 2025</span>
              </div>
              <p className="mt-3 whitespace-pre-line">
                Just checked memory usage of 3 platforms 🚀
                {'\n\n'}
                X: 286 MB
                {'\n'}
                YouTube: 201 MB
                {'\n'}
                LinkedIn: 1.2 GB 😅
                {'\n\n'}
                Why is a network for professionals heavier than a video platform?
                {'\n'}
                Feels like LinkedIn needs a performance review.
                {'\n\n'}
                #Tech #AIon #WebApps
              </p>

              {/* Attached Image Placeholder */}
              <div className="mt-4 relative rounded-2xl overflow-hidden bg-gray-900">
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Task Manager Screenshot (with circle & arrow)</span>
                </div>
                {/* Simulated circle and arrow */}
                <div className="absolute top-1/2 left-1/2 w-32 h-32 border-4 border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-1 bg-red-500 -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-1/4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-16 border-l-red-500 -translate-y-1/2"></div>
              </div>

              {/* Interaction Icons */}
              <div className="flex justify-between mt-6 max-w-md text-gray-500">
                <button className="hover:text-blue-500 transition">💬</button>
                <button className="hover:text-green-500 transition">🔁</button>
                <button className="hover:text-red-500 transition">❤️</button>
                <button className="hover:text-blue-500 transition">🔖</button>
              </div>
            </div>
          </div>
        </div>
      </main>

     
  );
}