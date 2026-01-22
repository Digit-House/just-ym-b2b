import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import TextareaField from '@/components/TextareaField';

const AutoResizeTextareaExample = () => {
  const [text, setText] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Auto-Resizing Textarea Examples</h1>

      {/* Example 1: Using the base Textarea component with autoResize prop */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">1. Base Textarea Component with Auto-Resize</h2>
        <Textarea
          autoResize={true}
          minHeight={100}
          maxHeight={300}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here to see auto-resizing in action..."
          className="w-full"
        />
        <p className="text-sm text-gray-600">
          Current text length: {text.length} characters
        </p>
      </div>

      {/* Example 2: Using TextareaField component with auto-resize */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">2. TextareaField Component with Auto-Resize</h2>
        <TextareaField
          label="Auto-resizing Description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          minHeight={120}
          maxHeight={400}
          placeholder="Start typing here to see the field grow with your content..."
        />
      </div>

      {/* Example 3: Multiple textareas with different settings */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">3. Different Auto-Resize Configurations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <TextareaField
              label="Small Max Height"
              value={text}
              onChange={(e) => setText(e.target.value)}
              minHeight={80}
              maxHeight={150}
              placeholder="Limited max height"
            />
          </div>
          <div>
            <TextareaField
              label="Large Max Height"
              value={text}
              onChange={(e) => setText(e.target.value)}
              minHeight={100}
              maxHeight={500}
              placeholder="Higher max height"
            />
          </div>
        </div>
      </div>

      {/* Example 4: Usage in a form */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">4. Form Example</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <TextareaField
            label="Description"
            value={text}
            onChange={(e) => setText(e.target.value)}
            minHeight={120}
            maxHeight={300}
            placeholder="Describe your item in detail..."
          />
          
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutoResizeTextareaExample;