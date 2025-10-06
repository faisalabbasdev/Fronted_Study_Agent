# LED Video Assets

This directory contains video files for the LED video effects on the homepage.

## Video Requirements

For the best LED effect, your videos should:

- **Format**: MP4 (H.264 codec)
- **Resolution**: 400x300 or higher (will be scaled down)
- **Duration**: 10-30 seconds (will loop automatically)
- **Content**: AI/tech related content works best
- **File Size**: Keep under 10MB for optimal loading

## Recommended Video Content

- AI brain animations
- Neural network visualizations
- Data processing animations
- Learning/education themed content
- Technology demonstrations

## Usage

To use a video file, simply place it in this directory and update the `src` prop in the LEDVideo component:

```tsx
<LEDVideo
  src="/videos/your-video.mp4"
  alt="Your Video Description"
  // ... other props
/>
```

## Fallback

If no video is provided, the component will automatically fall back to the animated LED demo with:
- Animated neural network patterns
- Pulsing LED grid effects
- Floating particles
- Brain icon animation

## Current Implementation

The homepage currently uses the LEDDemo component which provides a beautiful animated LED effect without requiring a video file.
