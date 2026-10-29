import React, { useRef, useEffect, useState, useCallback } from 'react';
import imgScratchCard from "figma:asset/5fdc704cb36ff7d9475f365db6bbbf656b346ac4.png";
import imgFrame from "figma:asset/e67c8a7de0942afa9a0800a2d4ba1ff604f9f016.png";
import CoinCursor from '../imports/CoinCursor-2030-54';
import Button from '../imports/Button';

const sufferingMessages = [
  "Make the logo bigger.",
  "Figma crashed before you hit save.",
  "Client feedback: \"Not feeling it.\"",
  "Auto-layout exploded.",
  "You forgot to name your layers.",
  "The dev ignored your spacing tokens.",
  "Someone used Papyrus unironically.",
  "\"Can we try Comic Sans for fun?\"",
  "You discovered yet another free font site.",
  "\"Make it pop.\"",
  "The kerning is off by 0.5px and you can't unsee it.",
  "Client approved v29.",
  "You accidentally exported at 1x.",
  "Prototype broke during presentation.",
  "\"Can you make it like Apple?\"",
  "That one pixel won't align.",
  "Free exposure gig offer.",
  "Your Dribbble shot got 2 likes (both bots).",
  "Fonts didn't sync across devices.",
  "Figma comments at 2 a.m.",
  "You forgot hover states.",
  "Contrast ratio: illegal.",
  "User test: everyone got confused.",
  "Dev used random hex codes.",
  "\"Accessibility can wait.\"",
  "Scrollbars everywhere.",
  "Buttons: all different sizes.",
  "\"This looks too modern.\"",
  "You opened Figma just to stare at it.",
  "Portfolio shame spiral (again).",
  "\"Why is design so expensive?\"",
  "You actually finished a side project. Rare.",
  "Someone said \"Design is just making things pretty.\"",
  "Client emailed a JPEG logo.",
  "That gradient looks like a bruise.",
  "Imposter syndrome unlocked.",
  "You spent 3 hours choosing a font.",
  "\"We don't need research.\"",
  "Pixel grid: ignored.",
  "You forgot to detach instance.",
  "\"Can we add more animations?\"",
  "Prototype link broken.",
  "You forgot to resize for mobile.",
  "Component overrides misbehaving.",
  "\"The CEO's kid wants to give feedback.\"",
  "You opened Illustrator by mistake.",
  "Sketch users judging you silently.",
  "Infinite \"final-final-v5\" files.",
  "You flattened text. Now it's gone.",
  "\"Let's brainstorm again.\"",
  "That \"one-hour\" feedback call lasted three.",
  "Client: \"I liked the first version better.\"",
  "You forgot to remove lorem ipsum.",
  "\"Make it look premium.\"",
  "Everyone ignored your design system.",
  "Your dev handoff PDF is unread.",
  "\"It doesn't feel right.\"",
  "You aligned by eye instead of grid.",
  "File name: Untitled.",
  "Figma plugin didn't work.",
  "\"We'll fix it in dev.\"",
  "Client: \"Can we make it TikTok-y?\"",
  "Text truncated in production.",
  "You forgot dark mode.",
  "\"We don't have time for QA.\"",
  "You presented to people who had cameras off.",
  "Exported SVG full of garbage.",
  "\"Looks different on my Android.\"",
  "You used 7 shades of grey accidentally.",
  "\"Make it more fun.\"",
  "Dev built your design in Times New Roman.",
  "\"We don't like whitespace.\"",
  "Button text: \"Click here now.\"",
  "That stock photo is cursed.",
  "\"Can we get more icons?\"",
  "Feedback from 12 stakeholders.",
  "They shared edits in a Word doc.",
  "You designed 30 versions of the same screen.",
  "\"Let's test it with no users.\"",
  "Your layers are a crime scene.",
  "\"This is too minimalist.\"",
  "Contrast mode revealed sins.",
  "\"We'll just copy Apple/Google.\"",
  "Forgot favicon.",
  "\"Let's go back to the first option.\"",
  "Prototype lagging mid-demo.",
  "Client used screenshots as assets.",
  "Your exported PDF is blurry.",
  "\"Our brand color is neon yellow.\"",
  "Everyone loves the ugly version.",
  "You shipped with a typo.",
  "\"Can we make it edgy?\"",
  "File corrupted.",
  "\"The founder wants Comic Sans.\"",
  "Design debt avalanche.",
  "Feedback: \"It's not sexy enough.\"",
  "\"We'll A/B test later.\"",
  "New intern renamed all frames.",
  "You hate your old work.",
  "Coffee on keyboard, Figma frozen.",
  "Use the same font."
];

// Header component with responsive text sizes
function Frame3() {
  return (
    <div className="bg-[#139f58] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 w-full">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col font-['Figma_Hand:Regular',_sans-serif] gap-2 items-center justify-center leading-[0] not-italic p-[24px] relative text-center text-white w-full">
          {/* Responsive text - smaller on mobile, larger on desktop */}
          <div className="relative shrink-0 text-[16px] sm:text-[40px] w-full">
            <p className="leading-[normal]">The Wheel of Suffering™</p>
          </div>
          <div className="relative shrink-0 text-[12px] sm:text-[22px] w-full">
            <p className="leading-[normal]">Odds of winning: 0%. Odds of crying: 100%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Frame6 wrapper component with responsive sizing
function Frame6({ scratchedMessage, canvasRef, handlers, showCursor, containerRef }) {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[8px] relative rounded-[24px] shrink-0 w-[296px] sm:w-[728px]">
      <div aria-hidden="true" className="absolute border-2 border-[#139f58] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <Frame3 />
      <div 
        ref={containerRef} 
        className="bg-[#cacaca] h-[363px] rounded-bl-[16px] rounded-br-[16px] shrink-0 w-full relative"
      >
        {/* Background with revealed message - always visible behind canvas */}
        <div className="absolute inset-0 flex items-center justify-center z-0 bg-white rounded-bl-[16px] rounded-br-[16px]">
          {/* Responsive text sizing for message */}
          <div className="font-['Instrument_Sans:Medium',_sans-serif] text-[24px] sm:text-[48px] text-black text-center leading-normal px-[15px] sm:px-[30px] max-w-full flex items-center justify-center h-full">
            <p className="leading-[normal]">{scratchedMessage}</p>
          </div>
        </div>
        
        {/* Interactive canvas overlay - this is the grey scratchable area */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-bl-[16px] rounded-br-[16px] z-10 select-none w-full h-full"
          onMouseDown={handlers.handleMouseDown}
          onMouseMove={handlers.handleMouseMove}
          onMouseUp={handlers.handleMouseUp}
          onMouseEnter={handlers.handleMouseEnter}
          onMouseLeave={handlers.handleMouseLeave}
          onTouchStart={handlers.handleTouchStart}
          onTouchMove={handlers.handleTouchMove}
          onTouchEnd={handlers.handleTouchEnd}
          style={{
            cursor: showCursor ? 'none' : 'pointer',
            touchAction: 'none'
          }}
        />
      </div>
    </div>
  );
}

export default function ScratchCardComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedMessage, setScratchedMessage] = useState(
    sufferingMessages[Math.floor(Math.random() * sufferingMessages.length)]
  );
  const [showCursor, setShowCursor] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track screen size for responsive background
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    
    // Set canvas size to match container
    canvas.width = width;
    canvas.height = height;

    // Clear any previous content
    ctx.clearRect(0, 0, width, height);
    
    // Reset composite operation to default for drawing
    ctx.globalCompositeOperation = 'source-over';
    
    // Fill the entire canvas with grey overlay
    ctx.fillStyle = '#cacaca';
    ctx.fillRect(0, 0, width, height);
    
    // Set blend mode for erasing (will be used in scratch function)
    ctx.globalCompositeOperation = 'destination-out';
    
    setIsCanvasReady(true);
  }, []);

  const refreshCard = useCallback(() => {
    // Reset canvas state first
    setIsCanvasReady(false);
    setIsScratching(false);
    setShowCursor(false);
    
    // Reinitialize canvas with fresh overlay first
    setTimeout(() => {
      initializeCanvas();
      
      // After canvas is restored, then update the message
      setTimeout(() => {
        setScratchedMessage(sufferingMessages[Math.floor(Math.random() * sufferingMessages.length)]);
      }, 100);
    }, 50);
  }, [initializeCanvas]);



  const scratch = useCallback((clientX: number, clientY: number) => {
    if (!isCanvasReady) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;

    // Ensure we're in erasing mode
    ctx.globalCompositeOperation = 'destination-out';
    
    // Calculate responsive scratch radius - larger on mobile for better touch interaction
    const scratchRadius = isMobile 
      ? Math.max(20, Math.min(40, canvas.width * 0.08)) // Larger radius for mobile (8% of width, 20-40px range)
      : Math.max(20, Math.min(50, canvas.width * 0.07)); // Increased radius for desktop (7% of width, 20-50px range)
    
    // Create circular scratch mark
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, scratchRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0,0,0,1)'; // Full opacity for complete erasure
    ctx.fill();
  }, [isCanvasReady]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  }, [scratch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  }, [isScratching, scratch]);

  const handleMouseUp = useCallback(() => {
    setIsScratching(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    // Only show cursor on non-touch devices
    if (!('ontouchstart' in window)) {
      setShowCursor(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowCursor(false);
    setIsScratching(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      setIsScratching(true);
      scratch(touch.clientX, touch.clientY);
    }
  }, [scratch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (isScratching && e.touches[0]) {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  }, [isScratching, scratch]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(false);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Reset canvas state
      setIsCanvasReady(false);
      // Reinitialize canvas with new dimensions after a delay
      setTimeout(() => {
        initializeCanvas();
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeCanvas]);

  // Initial canvas setup
  useEffect(() => {
    const setupCanvas = () => {
      // Wait for container to be rendered and have dimensions
      setTimeout(() => {
        initializeCanvas();
      }, 100);
    };

    setupCanvas();
  }, [initializeCanvas]);

  // Global event listeners for mouse up/touch end
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsScratching(false);
    const handleGlobalTouchEnd = () => setIsScratching(false);

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  // Collect all handlers for passing to components
  const handlers = {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };

  return (
    <div className="flex flex-col items-center">
      {/* Responsive background container */}
      <div 
        className="bg-center bg-cover bg-no-repeat relative w-[328px] h-[531px] sm:w-[800px] sm:h-[600px]" 
        data-name="Scratch card" 
        style={{ 
          backgroundImage: `url('${isMobile ? imgFrame : imgScratchCard}')` 
        }}
      >
        <div className="relative size-full">
          {/* Responsive padding - 16px on mobile, 36px on desktop */}
          <div className="box-border content-stretch flex flex-col gap-2.5 items-center sm:items-start justify-start p-[16px] sm:p-[36px] relative size-full">
            <Frame6 
              scratchedMessage={scratchedMessage}
              canvasRef={canvasRef}
              containerRef={containerRef}
              handlers={handlers}
              showCursor={showCursor}
            />
          </div>
        </div>
      </div>

      {/* Refresh Button - positioned 24px below the scratch card */}
      <div className="mt-6 flex justify-center">
        <div className="w-[150px] h-[48px]" onClick={refreshCard} style={{ cursor: 'pointer' }}>
          <Button />
        </div>
      </div>

      {/* Responsive coin cursor - only shown on non-touch devices */}
      {showCursor && !('ontouchstart' in window) && (
        <div 
          className="fixed pointer-events-none z-50 w-8 h-8 sm:w-12 sm:h-12 md:w-[120px] md:h-[120px]"
          style={{
            left: 'var(--mouse-x, 0px)',
            top: 'var(--mouse-y, 0px)',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <CoinCursor />
        </div>
      )}
    </div>
  );
}