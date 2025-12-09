'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Circle, Square, Minus, Info, Lightbulb, Quote, Bookmark } from 'lucide-react';

// ============================================
// SIDE NOTE COMPONENT
// ============================================
type NoteType = 'info' | 'insight' | 'quote' | 'tip';

function SideNote({
  children,
  type = 'info',
  position = 'right',
  delay = 0.5
}: {
  children: React.ReactNode;
  type?: NoteType;
  position?: 'left' | 'right' | 'bottom-left' | 'bottom-right';
  delay?: number;
}) {
  const icons = {
    info: <Info className="w-3 h-3" />,
    insight: <Lightbulb className="w-3 h-3" />,
    quote: <Quote className="w-3 h-3" />,
    tip: <Bookmark className="w-3 h-3" />,
  };

  const colors = {
    info: 'border-blue-500/30 bg-blue-500/5 text-blue-300',
    insight: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-300',
    quote: 'border-purple-500/30 bg-purple-500/5 text-purple-300',
    tip: 'border-green-500/30 bg-green-500/5 text-green-300',
  };

  const positions = {
    right: 'right-4 top-1/4',
    left: 'left-4 top-1/4',
    'bottom-left': 'left-4 bottom-20',
    'bottom-right': 'right-4 bottom-20',
  };

  return (
    <motion.div
      className={`absolute ${positions[position]} max-w-[200px] p-3 border rounded-lg ${colors[type]} text-xs leading-relaxed z-40`}
      initial={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex-shrink-0 opacity-60">{icons[type]}</span>
        <span className="opacity-80">{children}</span>
      </div>
    </motion.div>
  );
}

// ============================================
// JAPANESE DESIGN INFLUENCES PRESENTATION
//
// Exploring the synthesis of:
// 1. Ikko Tanaka - Geometric minimalism
// 2. PlayStation 4 UI - Sony's zen interface
// 3. Their common Japanese design heritage
// ============================================

const SLIDES = [
  'title',
  'two-solutions',
  'influence-map',
  // OS Solution - Desktop Paradigm
  'os-solution',
  'macos-intro',
  'mingei-intro',
  'boids-intro',
  'dithering-intro',
  // OS2 Solution - PS4 Console
  'os2-solution',
  'ps4-intro',
  'ps4-principles',
  'tanaka-intro',
  'tanaka-principles',
  // Common Ground
  'common-thread',
  'ma-concept',
  'comparison',
  'conclusion',
  'mockups',
] as const;

type SlideId = typeof SLIDES[number];

export default function DesignInfluencesPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < SLIDES.length) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    }
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] relative">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-white/60"
          animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide container */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <SlideContent slideId={SLIDES[currentSlide]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-50">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className="p-3 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 text-white/30 text-sm tabular-nums">
        {currentSlide + 1} / {SLIDES.length}
      </div>
    </div>
  );
}

// ============================================
// SLIDE CONTENT
// ============================================
function SlideContent({ slideId }: { slideId: SlideId }) {
  switch (slideId) {
    case 'title':
      return <SlideTitle />;
    case 'two-solutions':
      return <SlideTwoSolutions />;
    case 'influence-map':
      return <SlideInfluenceMap />;
    case 'os-solution':
      return <SlideOSSolution />;
    case 'os2-solution':
      return <SlideOS2Solution />;
    case 'tanaka-intro':
      return <SlideTanakaIntro />;
    case 'tanaka-principles':
      return <SlideTanakaPrinciples />;
    case 'ps4-intro':
      return <SlidePS4Intro />;
    case 'ps4-principles':
      return <SlidePS4Principles />;
    case 'mingei-intro':
      return <SlideMingeiIntro />;
    case 'boids-intro':
      return <SlideBoidsIntro />;
    case 'dithering-intro':
      return <SlideDitheringIntro />;
    case 'macos-intro':
      return <SlideMacOSIntro />;
    case 'common-thread':
      return <SlideCommonThread />;
    case 'ma-concept':
      return <SlideMaConcept />;
    case 'comparison':
      return <SlideComparison />;
    case 'conclusion':
      return <SlideConclusion />;
    case 'mockups':
      return <SlideMockups />;
    default:
      return null;
  }
}

// ============================================
// INDIVIDUAL SLIDES
// ============================================

function SlideTitle() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center"
      >
        {/* Japanese geometric motif */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <motion.div
            className="w-16 h-16 bg-[#c23a3a]"
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-16 h-16 rounded-full bg-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-16 h-16 bg-[#2a6a4a]"
            animate={{ rotate: [0, -90, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <h1 className="text-7xl md:text-8xl font-bold text-white mb-6">
          Two Worlds
        </h1>
        <p className="text-2xl text-white/50 mb-4">
          One Design Philosophy
        </p>
        <p className="text-lg text-white/30 tracking-[0.3em] uppercase">
          Ikko Tanaka × PlayStation 4
        </p>
      </motion.div>

      {/* Side notes */}
      <SideNote type="info" position="right" delay={1}>
        The three shapes represent Tanaka's core vocabulary: square (stability), circle (harmony), and the interplay between them.
      </SideNote>
      <SideNote type="insight" position="left" delay={1.3}>
        Both Tanaka and PS4 emerged from Sony's design ecosystem—Tanaka consulted for Sony in the 1980s.
      </SideNote>
      <SideNote type="tip" position="bottom-right" delay={1.6}>
        Use arrow keys or swipe to navigate. Press Space to advance.
      </SideNote>
    </div>
  );
}

function SlideTwoSolutions() {
  return (
    <div className="flex h-full relative">
      {/* Left: OS - Desktop */}
      <motion.div
        className="w-1/2 h-full flex flex-col items-center justify-center p-12 relative"
        style={{ backgroundColor: '#1a2a3a' }}
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="text-center">
          {/* Desktop icon */}
          <div className="relative w-32 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-[#2a3a4a] rounded-lg border border-white/20">
              <div className="h-4 bg-[#3a4a5a] rounded-t-lg flex items-center px-2 gap-1">
                <div className="w-2 h-2 rounded-full bg-[#c23a3a]" />
                <div className="w-2 h-2 rounded-full bg-[#c4a020]" />
                <div className="w-2 h-2 rounded-full bg-[#2a6a4a]" />
              </div>
            </div>
            {/* Fish swimming */}
            <motion.div
              className="absolute bottom-2 left-4 text-lg"
              animate={{ x: [0, 80, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              🐟
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            OS
          </h2>
          <p className="text-white/60 text-lg">
            Desktop Paradigm
          </p>
          <p className="text-white/40 mt-2">
            macOS + Mingei + Boids
          </p>
          <p className="text-[#2a6a4a] mt-4 text-sm font-mono">
            /dec-launch/os
          </p>
        </div>

        {/* Side notes for OS */}
        <motion.div
          className="absolute bottom-24 left-4 max-w-[180px] p-2 border border-green-500/30 bg-green-500/5 rounded text-xs text-green-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span className="opacity-80">Best for: productivity, multi-tasking, creative workflows</span>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-12 left-12 w-8 h-8 border-2 border-white/10" />
        <div className="absolute bottom-12 right-12 w-12 h-12 rounded-full border-2 border-[#2a6a4a]/40" />
      </motion.div>

      {/* Right: OS2 - Console */}
      <motion.div
        className="w-1/2 h-full flex flex-col items-center justify-center p-12 relative"
        style={{ backgroundColor: '#0a0a12' }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="text-center">
          {/* PS4-style tiles */}
          <div className="flex items-end justify-center gap-2 mb-8">
            {['魚', '端', '書', '映'].map((kanji, i) => (
              <motion.div
                key={kanji}
                className={`flex items-center justify-center rounded ${
                  i === 0 ? 'w-14 h-14 bg-[#3a4a8a] border border-white/30' : 'w-10 h-10 bg-white/10'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className={`${i === 0 ? 'text-xl text-white' : 'text-sm text-white/50'}`}>
                  {kanji}
                </span>
              </motion.div>
            ))}
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            OS2
          </h2>
          <p className="text-white/60 text-lg">
            Console Interface
          </p>
          <p className="text-white/40 mt-2">
            PS4 + Tanaka Aesthetics
          </p>
          <p className="text-[#3a4a8a] mt-4 text-sm font-mono">
            /dec-launch/os2
          </p>
        </div>

        {/* Side notes for OS2 */}
        <motion.div
          className="absolute bottom-24 right-4 max-w-[180px] p-2 border border-blue-500/30 bg-blue-500/5 rounded text-xs text-blue-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <span className="opacity-80">Best for: presentations, kiosks, focused single-task modes</span>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-12 right-12 w-8 h-8 rounded-full bg-[#3a4a8a]/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="absolute bottom-12 left-12 w-12 h-1 bg-white/10" />
      </motion.div>

      {/* Center insight */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 max-w-[280px] p-3 border border-yellow-500/30 bg-black/80 rounded-lg text-xs text-yellow-300 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-start gap-2">
          <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-60" />
          <span className="opacity-80">Same design principles, different interaction models. Choose based on your use case.</span>
        </div>
      </motion.div>
    </div>
  );
}

function SlideTanakaIntro() {
  return (
    <div className="h-full flex items-center justify-center p-16" style={{ backgroundColor: '#f5f0e6' }}>
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-[#c23a3a]" />
            <div>
              <h2 className="text-5xl font-bold text-[#1a1a18]">田中一光</h2>
              <p className="text-xl text-[#1a1a18]/60 mt-2">Ikko Tanaka</p>
            </div>
          </div>

          <blockquote className="text-3xl text-[#1a1a18]/80 leading-relaxed font-light border-l-4 border-[#c23a3a] pl-8 mb-12">
            "Design is the method of putting form and content together. Design, just as art, has multiple definitions; there is no single definition."
          </blockquote>

          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-[#1a1a18]/5">
              <p className="text-4xl font-bold text-[#c23a3a]">MUJI</p>
              <p className="text-[#1a1a18]/60 mt-2">Brand Identity</p>
            </div>
            <div className="p-6 bg-[#1a1a18]/5">
              <p className="text-4xl font-bold text-[#1a1a18]">無印良品</p>
              <p className="text-[#1a1a18]/60 mt-2">"No-brand quality goods"</p>
            </div>
            <div className="p-6 bg-[#1a1a18]/5">
              <p className="text-4xl font-bold text-[#2a6a4a]">Rinpa</p>
              <p className="text-[#1a1a18]/60 mt-2">Art Movement</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideTanakaPrinciples() {
  const principles = [
    {
      title: 'Geometric Abstraction',
      desc: 'Reducing complex forms to essential shapes—circles, squares, triangles—that carry universal meaning.',
      visual: (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#c23a3a]" />
          <div className="w-12 h-12 bg-[#2a6a4a]" />
          <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px] border-b-[#c4a020]" />
        </div>
      ),
    },
    {
      title: 'Bold Color Fields',
      desc: 'Large areas of uninterrupted color creating visual impact and emotional resonance.',
      visual: (
        <div className="flex h-12 overflow-hidden">
          <div className="w-16 bg-[#c23a3a]" />
          <div className="w-16 bg-[#f5f0e6]" />
          <div className="w-16 bg-[#1a1a18]" />
        </div>
      ),
    },
    {
      title: 'Grid Discipline',
      desc: 'Precise mathematical relationships between elements, creating harmony through structure.',
      visual: (
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`w-3 h-3 ${i % 3 === 0 ? 'bg-[#c23a3a]' : 'bg-[#1a1a18]/20'}`} />
          ))}
        </div>
      ),
    },
    {
      title: 'Kanji as Form',
      desc: 'Typography treated as visual element, where characters become abstract shapes.',
      visual: (
        <span className="text-4xl font-bold text-[#1a1a18]" style={{ fontFamily: 'serif' }}>
          魚
        </span>
      ),
    },
  ];

  return (
    <div className="h-full flex items-center justify-center p-12" style={{ backgroundColor: '#f5f0e6' }}>
      <div className="w-full max-w-5xl">
        <h2 className="text-4xl font-bold text-[#1a1a18] mb-12 text-center">
          Tanaka's Design Principles
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-6 bg-white border border-[#1a1a18]/10"
            >
              <div className="h-16 flex items-center mb-4">
                {p.visual}
              </div>
              <h3 className="text-xl font-bold text-[#1a1a18] mb-2">{p.title}</h3>
              <p className="text-[#1a1a18]/60 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideTanakaVisual() {
  return (
    <div className="h-full flex items-center justify-center" style={{ backgroundColor: '#d4c4a8' }}>
      {/* Tanaka-style composition */}
      <svg viewBox="0 0 800 600" className="w-full max-w-4xl h-auto">
        {/* Background elements */}
        <motion.circle
          cx="400"
          cy="250"
          r="180"
          fill="#f5f0e6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Red accent rectangle */}
        <motion.rect
          x="100"
          y="80"
          width="600"
          height="60"
          fill="#c23a3a"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ transformOrigin: 'left' }}
        />

        {/* Body rectangle */}
        <motion.rect
          x="300"
          y="350"
          width="200"
          height="220"
          fill="#1a1a18"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ transformOrigin: 'top' }}
        />

        {/* Small squares */}
        <motion.rect
          x="140"
          y="380"
          width="50"
          height="50"
          fill="#c23a3a"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        />
        <motion.rect
          x="610"
          y="380"
          width="50"
          height="50"
          fill="#c23a3a"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        />

        {/* Diagonal line */}
        <motion.line
          x1="140"
          y1="520"
          x2="660"
          y2="460"
          stroke="#2a6a4a"
          strokeWidth="8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        />

        {/* Text overlay */}
        <motion.text
          x="400"
          y="560"
          textAnchor="middle"
          fill="#1a1a18"
          fontSize="24"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
        >
          Nihon Buyo Abstraction
        </motion.text>
      </svg>
    </div>
  );
}

function SlidePS4Intro() {
  return (
    <div className="h-full flex items-center justify-center p-16 bg-[#0a0a12]">
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* PS4 symbols */}
          <div className="flex items-center gap-8 mb-12">
            <motion.div
              className="w-12 h-12 border-2 border-[#00d9f5] rotate-45"
              animate={{ rotate: [45, 135, 45] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="w-12 h-12 rounded-full border-2 border-[#f05454]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="w-12 h-12 flex items-center justify-center">
              <div className="w-10 h-10 border-t-2 border-l-2 border-[#00cc55] -rotate-45" />
            </div>
            <Square className="w-10 h-10 text-[#ec87c0]" strokeWidth={2} />
          </div>

          <h2 className="text-5xl font-bold text-white mb-6">PlayStation 4 UI</h2>
          <p className="text-xl text-white/60 mb-12">
            A masterclass in calm, focused interface design
          </p>

          <blockquote className="text-2xl text-white/70 leading-relaxed font-light border-l-4 border-[#3a4a8a] pl-8 mb-12">
            "The PS4 interface was designed to feel like a living room—warm, inviting, and never demanding attention."
          </blockquote>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-white/5 rounded">
              <p className="text-3xl font-bold text-[#00d9f5]">110M+</p>
              <p className="text-white/40 mt-2">Units Sold</p>
            </div>
            <div className="p-4 bg-white/5 rounded">
              <p className="text-3xl font-bold text-white">2013</p>
              <p className="text-white/40 mt-2">Launch Year</p>
            </div>
            <div className="p-4 bg-white/5 rounded">
              <p className="text-3xl font-bold text-[#3a4a8a]">Zen</p>
              <p className="text-white/40 mt-2">Design Philosophy</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlidePS4Principles() {
  const principles = [
    {
      title: 'Horizontal Flow',
      desc: 'Content flows left-to-right, matching natural reading patterns and controller navigation.',
      color: '#00d9f5',
    },
    {
      title: 'Content-First',
      desc: 'The UI disappears when not needed, putting games and media at center stage.',
      color: '#f05454',
    },
    {
      title: 'Ambient Motion',
      desc: 'Subtle animations that breathe life without demanding attention.',
      color: '#00cc55',
    },
    {
      title: 'Dark Canvas',
      desc: 'Deep blacks create focus and reduce eye strain during long sessions.',
      color: '#ec87c0',
    },
  ];

  return (
    <div className="h-full flex items-center justify-center p-12 bg-[#0a0a12]">
      <div className="w-full max-w-5xl">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          PS4 Interface Principles
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-6 bg-white/[0.03] border border-white/10 rounded"
            >
              <div className="w-12 h-1 mb-4" style={{ backgroundColor: p.color }} />
              <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlidePS4Visual() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 bg-[#0a0a12]">
      {/* PS4-style horizontal menu recreation */}
      <div className="w-full max-w-4xl">
        {/* Content preview area */}
        <motion.div
          className="w-full aspect-video bg-gradient-to-br from-[#1a1a2a] to-[#0a0a12] rounded-lg mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/20 text-xl">Content Preview Area</p>
        </motion.div>

        {/* Menu tiles */}
        <div className="flex items-end gap-4 justify-center">
          {['Games', 'Media', 'Store', 'Settings'].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className={`flex flex-col items-center ${i === 0 ? 'scale-110' : ''}`}
            >
              <div
                className={`w-20 h-20 flex items-center justify-center rounded ${
                  i === 0 ? 'bg-[#3a4a8a] border-2 border-white/80' : 'bg-white/10'
                }`}
              >
                <span className={`text-2xl ${i === 0 ? 'text-white' : 'text-white/50'}`}>
                  {['🎮', '🎬', '🛒', '⚙️'][i]}
                </span>
              </div>
              <span className={`mt-2 text-sm ${i === 0 ? 'text-white' : 'text-white/40'}`}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.p
        className="text-white/30 text-sm mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Large tiles. Horizontal scroll. Focus states. Breathing room.
      </motion.p>
    </div>
  );
}

function SlideCommonThread() {
  return (
    <div className="h-full flex items-center justify-center p-12 bg-gradient-to-br from-[#1a1a18] to-[#0a0a12]">
      <div className="max-w-4xl text-center">
        <motion.h2
          className="text-5xl font-bold text-white mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          The Common Thread
        </motion.h2>

        <motion.p
          className="text-3xl text-white/70 mb-16 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Both draw from the same Japanese design heritage
        </motion.p>

        <div className="grid grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6"
          >
            <span className="text-5xl mb-4 block">間</span>
            <h3 className="text-xl font-bold text-white mb-2">Ma (Space)</h3>
            <p className="text-white/50 text-sm">Negative space as active element</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6"
          >
            <span className="text-5xl mb-4 block">侘寂</span>
            <h3 className="text-xl font-bold text-white mb-2">Wabi-Sabi</h3>
            <p className="text-white/50 text-sm">Beauty in imperfection and simplicity</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6"
          >
            <span className="text-5xl mb-4 block">縁</span>
            <h3 className="text-xl font-bold text-white mb-2">En (Connection)</h3>
            <p className="text-white/50 text-sm">Meaningful relationships between elements</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SlideMaConcept() {
  return (
    <div className="h-full flex items-center justify-center p-12 bg-[#f5f0e6]">
      <div className="max-w-5xl">
        <div className="flex items-start gap-16">
          {/* Left: Concept */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[180px] font-bold text-[#1a1a18] leading-none">間</span>
            <h2 className="text-4xl font-bold text-[#1a1a18] mt-4">Ma</h2>
            <p className="text-[#1a1a18]/60 text-xl mt-2">The pregnant pause</p>
          </motion.div>

          {/* Right: Explanation */}
          <motion.div
            className="flex-1 pt-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-2xl text-[#1a1a18]/80 leading-relaxed mb-8">
              Ma is not emptiness—it is potential. The space between things that gives them meaning.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#c23a3a]" />
                <Minus className="w-8 h-8 text-[#1a1a18]/30" />
                <div className="w-16 h-16 bg-[#c23a3a]" />
                <p className="text-[#1a1a18]/60 ml-4">Space creates relationship</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-[#1a1a18]/30" />
                <p className="text-[#1a1a18]/60 ml-4">Tanaka: White space as composition</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-4 bg-[#1a1a18]/10 rounded" />
                <p className="text-[#1a1a18]/60 ml-4">PS4: Content breathes</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SlideSynthesis() {
  return (
    <div className="h-full flex items-center justify-center p-12 bg-[#0a0a0a]">
      <div className="max-w-5xl w-full">
        <motion.h2
          className="text-4xl font-bold text-white mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          The Synthesis: Tanaka × PS4
        </motion.h2>

        <div className="grid grid-cols-2 gap-12">
          {/* What we take from Tanaka */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 border border-[#c23a3a]/30 bg-[#c23a3a]/5"
          >
            <h3 className="text-2xl font-bold text-[#c23a3a] mb-6">From Tanaka</h3>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#c23a3a] mt-2 flex-shrink-0" />
                <span>Bold geometric shapes as navigation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#c23a3a] mt-2 flex-shrink-0" />
                <span>Kanji icons for cultural resonance</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#c23a3a] mt-2 flex-shrink-0" />
                <span>Kraft paper warmth in dark mode</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#c23a3a] mt-2 flex-shrink-0" />
                <span>Single accent color philosophy</span>
              </li>
            </ul>
          </motion.div>

          {/* What we take from PS4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 border border-[#3a4a8a]/30 bg-[#3a4a8a]/5"
          >
            <h3 className="text-2xl font-bold text-[#3a4a8a] mb-6">From PS4</h3>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#3a4a8a] mt-2 flex-shrink-0" />
                <span>Horizontal navigation with large tiles</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#3a4a8a] mt-2 flex-shrink-0" />
                <span>Content preview above selection</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#3a4a8a] mt-2 flex-shrink-0" />
                <span>Keyboard + scroll wheel navigation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#3a4a8a] mt-2 flex-shrink-0" />
                <span>Ambient motion and transitions</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SlideImprovements() {
  const improvements = [
    {
      title: 'Dynamic Color System',
      current: 'Static accent per section',
      improved: 'Colors that respond to content and time of day',
    },
    {
      title: 'Haptic Feedback',
      current: 'Visual-only feedback',
      improved: 'Subtle audio cues matching Tanaka\'s rhythm',
    },
    {
      title: 'Contextual Ma',
      current: 'Fixed spacing',
      improved: 'Breathing space that expands with focus',
    },
    {
      title: 'Layered Depth',
      current: 'Flat hierarchy',
      improved: 'SVG dithering for unfocused elements',
    },
  ];

  return (
    <div className="h-full flex items-center justify-center p-12 bg-[#0a0a0a]">
      <div className="max-w-4xl w-full">
        <motion.h2
          className="text-4xl font-bold text-white mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Opportunities for Improvement
        </motion.h2>

        <div className="space-y-6">
          {improvements.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-stretch gap-6 p-6 bg-white/[0.02] border border-white/10"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white/30 text-sm">Current</p>
                    <p className="text-white/50">{item.current}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/20" />
                  <div className="flex-1">
                    <p className="text-[#2a6a4a] text-sm">Improved</p>
                    <p className="text-white/70">{item.improved}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideConclusion() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#1a1a18] to-[#0a0a12]">
      <motion.div
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Combined motif */}
        <div className="flex items-center justify-center gap-8 mb-12">
          <div className="w-20 h-20 bg-[#c23a3a]" />
          <div className="w-20 h-20 rounded-full border-2 border-white/50 flex items-center justify-center">
            <span className="text-3xl">間</span>
          </div>
          <div className="w-20 h-20 bg-[#3a4a8a]" />
        </div>

        <h2 className="text-5xl font-bold text-white mb-6">
          Design is a Bridge
        </h2>

        <p className="text-2xl text-white/60 leading-relaxed mb-12">
          Tanaka bridged tradition and modernity.<br />
          PlayStation bridged technology and living rooms.<br />
          <span className="text-white">We bridge both to create something new.</span>
        </p>

        <div className="flex items-center justify-center gap-4 text-white/30">
          <span>田中一光</span>
          <span>×</span>
          <span>PlayStation</span>
          <span>×</span>
          <span>Mino</span>
        </div>
      </motion.div>
    </div>
  );
}

function SlideMockups() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
      <motion.h2
        className="text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Interface Mockups
      </motion.h2>

      <div className="flex gap-8 w-full max-w-6xl">
        {/* OS Mockup - Desktop */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-4">
            <span className="text-[#2a6a4a] font-bold text-xl">OS</span>
            <p className="text-white/40 text-sm">Desktop Paradigm</p>
          </div>

          {/* Desktop mockup frame */}
          <div className="relative bg-gradient-to-br from-[#1a2a3a] to-[#0a1520] rounded-lg p-3 shadow-2xl border border-[#2a6a4a]/30">
            {/* Menu bar */}
            <div className="h-5 bg-[#2a3a4a] rounded-t flex items-center px-2 gap-3 mb-2">
              <span className="text-white/60 text-xs">Mino</span>
              <span className="text-white/40 text-xs">File</span>
              <span className="text-white/40 text-xs">Edit</span>
              <span className="text-white/40 text-xs">View</span>
            </div>

            {/* Desktop area with windows */}
            <div className="relative h-56 bg-[#0a1520] rounded overflow-hidden">
              {/* Animated fish background */}
              <div className="absolute inset-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute text-[10px]"
                    style={{ top: `${15 + i * 15}%`, left: `${10 + i * 12}%` }}
                    animate={{
                      x: [0, 30 + i * 10, 0],
                      y: [0, Math.sin(i) * 10, 0]
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    🐟
                  </motion.div>
                ))}
              </div>

              {/* Back window (dithered/unfocused) */}
              <motion.div
                className="absolute w-28 h-20 bg-[#3a4a5a]/60 rounded shadow-lg backdrop-blur-sm"
                style={{ top: 15, left: 15, filter: 'blur(1px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5 }}
              >
                <div className="h-4 bg-[#4a5a6a]/60 rounded-t flex items-center px-1.5 gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c23a3a]/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c4a020]/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2a6a4a]/60" />
                </div>
                <div className="p-1">
                  <div className="h-1 bg-white/10 rounded w-3/4 mb-1" />
                  <div className="h-1 bg-white/10 rounded w-1/2" />
                </div>
              </motion.div>

              {/* Front window (focused) */}
              <motion.div
                className="absolute w-32 h-24 bg-[#4a5a6a] rounded shadow-xl border border-white/20"
                style={{ top: 40, left: 70 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="h-4 bg-[#5a6a7a] rounded-t flex items-center px-1.5 gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c23a3a]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c4a020]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2a6a4a]" />
                  <span className="text-white/60 text-[6px] ml-1">Notes</span>
                </div>
                <div className="p-1.5">
                  <div className="h-1 bg-white/20 rounded w-full mb-1" />
                  <div className="h-1 bg-white/20 rounded w-3/4 mb-1" />
                  <div className="h-1 bg-white/20 rounded w-5/6" />
                </div>
              </motion.div>

              {/* Third window */}
              <motion.div
                className="absolute w-24 h-16 bg-[#3a4a5a]/70 rounded shadow-lg"
                style={{ top: 85, left: 140, filter: 'blur(0.5px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.6 }}
              >
                <div className="h-3 bg-[#4a5a6a]/70 rounded-t flex items-center px-1 gap-0.5">
                  <div className="w-1 h-1 rounded-full bg-[#c23a3a]/70" />
                  <div className="w-1 h-1 rounded-full bg-[#c4a020]/70" />
                  <div className="w-1 h-1 rounded-full bg-[#2a6a4a]/70" />
                </div>
              </motion.div>
            </div>

            {/* Dock */}
            <motion.div
              className="flex items-center justify-center gap-1.5 mt-2 h-8 bg-white/10 rounded-lg px-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {['📁', '🌐', '📝', '🎵', '⚙️'].map((icon, i) => (
                <div
                  key={i}
                  className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-[10px]"
                >
                  {icon}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p
            className="text-center text-white/40 text-xs mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Draggable windows • Boids fish • SVG dithering
          </motion.p>
        </motion.div>

        {/* OS2 Mockup - PS4 Style Console */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-4">
            <span className="text-[#3a4a8a] font-bold text-xl">OS2</span>
            <p className="text-white/40 text-sm">Console Interface</p>
          </div>

          {/* PS4-style mockup frame - full bleed dark */}
          <div className="relative bg-[#000810] rounded-lg overflow-hidden shadow-2xl border border-[#1a2a3a]/50" style={{ aspectRatio: '16/10' }}>
            {/* Ambient background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1525] via-[#000810] to-[#000508]" />

            {/* Subtle particle/star effect */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 60}%`,
                  }}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Top bar - PS4 style minimal */}
            <div className="relative flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0066cc] to-[#004499] flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-white text-[7px] font-bold">M</span>
                </motion.div>
                <span className="text-white/70 text-[10px]">Mino</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 text-[9px]">
                <span>🔔</span>
                <span>👤</span>
                <span>⚙️</span>
              </div>
            </div>

            {/* Large content preview - hero area */}
            <motion.div
              className="relative mx-4 h-28 rounded overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a5a] via-[#2a4a6a] to-[#1a3a5a]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="text-white font-bold text-sm">Fish Aquarium</p>
                <p className="text-white/60 text-[9px]">Interactive • Boids Simulation</p>
              </div>
              {/* Play button indicator */}
              <motion.div
                className="absolute right-4 bottom-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-xs ml-0.5">▶</span>
              </motion.div>
            </motion.div>

            {/* PS4-style horizontal tiles - left aligned, different sizes */}
            <div className="relative mt-4 px-4">
              <div className="flex items-end gap-2">
                {[
                  { kanji: '魚', label: 'Fish', active: true, color: '#0066cc' },
                  { kanji: '端', label: 'Apps', active: false, color: '#444' },
                  { kanji: '書', label: 'Docs', active: false, color: '#444' },
                  { kanji: '映', label: 'Media', active: false, color: '#444' },
                  { kanji: '設', label: 'Settings', active: false, color: '#444' },
                  { kanji: '店', label: 'Store', active: false, color: '#444' },
                ].map((item, i) => (
                  <motion.div
                    key={item.kanji}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      className={`flex items-center justify-center rounded-sm transition-all relative ${
                        item.active
                          ? 'w-14 h-14'
                          : 'w-10 h-10'
                      }`}
                      style={{
                        backgroundColor: item.active ? item.color : 'rgba(255,255,255,0.08)',
                        boxShadow: item.active ? '0 4px 20px rgba(0,102,204,0.4)' : 'none',
                      }}
                      animate={item.active ? { y: [0, -2, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {/* Active indicator line */}
                      {item.active && (
                        <motion.div
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.8 }}
                        />
                      )}
                      <span className={`${item.active ? 'text-xl text-white' : 'text-sm text-white/40'}`}>
                        {item.kanji}
                      </span>
                    </motion.div>
                    <span className={`mt-2 text-[7px] ${item.active ? 'text-white' : 'text-white/30'}`}>
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom bar - PS4 controller hints */}
            <motion.div
              className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-4 text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center gap-3 text-[8px]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border border-white/30 flex items-center justify-center text-[6px]">✕</span>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border border-white/30 flex items-center justify-center text-[6px]">○</span>
                  Back
                </span>
              </div>
              <div className="flex items-center gap-1 text-[8px]">
                <span className="opacity-50">OPTIONS</span>
                <span className="w-4 h-2 rounded-sm border border-white/30" />
              </div>
            </motion.div>
          </div>

          <motion.p
            className="text-center text-white/40 text-xs mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            PS4-style navigation • Large tiles • Content-first
          </motion.p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-white/30 text-sm">
          Two interfaces, one philosophy: <span className="text-white/60">間 (Ma)</span>
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <a
            href="#"
            className="text-[#2a6a4a] text-sm hover:text-[#3a8a5a] transition-colors"
          >
            /dec-launch/os →
          </a>
          <a
            href="#"
            className="text-[#3a4a8a] text-sm hover:text-[#4a5a9a] transition-colors"
          >
            /dec-launch/os2 →
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// NEW INFLUENCE SLIDES
// ============================================

function SlideInfluenceMap() {
  // OS influences (left side - Desktop)
  const osInfluences = [
    { name: 'macOS', kanji: '窓', color: '#4a6a8a', x: 120, y: 180, desc: 'Desktop paradigm' },
    { name: 'Mingei', kanji: '民', color: '#8b6914', x: 120, y: 280, desc: 'Folk craft beauty' },
    { name: 'Boids', kanji: '群', color: '#2a6a4a', x: 120, y: 380, desc: 'Emergent behavior' },
    { name: 'Dithering', kanji: '霧', color: '#6a4a8a', x: 220, y: 330, desc: 'Depth through noise' },
  ];

  // OS2 influences (right side - Console)
  const os2Influences = [
    { name: 'PlayStation 4', kanji: '遊', color: '#3a4a8a', x: 680, y: 180, desc: 'Zen interface' },
    { name: 'Ikko Tanaka', kanji: '田', color: '#c23a3a', x: 680, y: 280, desc: 'Geometric minimalism' },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
      <motion.h2
        className="text-4xl font-bold text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Influence Architecture
      </motion.h2>

      <div className="relative w-full max-w-5xl" style={{ height: '70vh' }}>
        <svg viewBox="0 0 800 500" className="w-full h-full">
          {/* OS Box (left) */}
          <motion.g
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <rect x="40" y="100" width="260" height="340" rx="8" fill="#1a2a3a" fillOpacity="0.5" stroke="#2a6a4a" strokeWidth="2" />
            <text x="170" y="140" textAnchor="middle" fill="#2a6a4a" fontSize="20" fontWeight="bold">OS</text>
            <text x="170" y="160" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="12">Desktop Paradigm</text>
          </motion.g>

          {/* OS2 Box (right) */}
          <motion.g
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <rect x="500" y="100" width="260" height="340" rx="8" fill="#0a0a12" fillOpacity="0.8" stroke="#3a4a8a" strokeWidth="2" />
            <text x="630" y="140" textAnchor="middle" fill="#3a4a8a" fontSize="20" fontWeight="bold">OS2</text>
            <text x="630" y="160" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="12">Console Interface</text>
          </motion.g>

          {/* Center connection - Both share Japanese philosophy */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <rect x="330" y="200" width="140" height="100" rx="8" fill="white" fillOpacity="0.05" stroke="white" strokeWidth="1" strokeDasharray="4,4" />
            <text x="400" y="240" textAnchor="middle" fill="white" fontSize="24">間</text>
            <text x="400" y="265" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="11">Shared: Ma</text>
            <text x="400" y="280" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="10">Japanese Space</text>

            {/* Lines to center */}
            <line x1="300" y1="250" x2="330" y2="250" stroke="white" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.3" />
            <line x1="470" y1="250" x2="500" y2="250" stroke="white" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.3" />
          </motion.g>

          {/* OS Influence nodes */}
          {osInfluences.map((inf, i) => (
            <motion.g
              key={inf.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <circle cx={inf.x} cy={inf.y} r="35" fill={inf.color} opacity="0.2" />
              <circle cx={inf.x} cy={inf.y} r="28" fill={inf.color} />
              <text x={inf.x} y={inf.y + 6} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
                {inf.kanji}
              </text>
              <text x={inf.x} y={inf.y + 50} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                {inf.name}
              </text>
              <text x={inf.x} y={inf.y + 64} textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="9">
                {inf.desc}
              </text>
            </motion.g>
          ))}

          {/* OS2 Influence nodes */}
          {os2Influences.map((inf, i) => (
            <motion.g
              key={inf.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            >
              <circle cx={inf.x} cy={inf.y} r="35" fill={inf.color} opacity="0.2" />
              <circle cx={inf.x} cy={inf.y} r="28" fill={inf.color} />
              <text x={inf.x} y={inf.y + 6} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
                {inf.kanji}
              </text>
              <text x={inf.x} y={inf.y + 50} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                {inf.name}
              </text>
              <text x={inf.x} y={inf.y + 64} textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="9">
                {inf.desc}
              </text>
            </motion.g>
          ))}

          {/* Arrows showing flow */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1 }}
          >
            {/* OS connections */}
            <path d="M155 180 L185 200" stroke="#4a6a8a" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <path d="M155 280 L185 300" stroke="#8b6914" strokeWidth="2" />
            <path d="M155 380 L185 360" stroke="#2a6a4a" strokeWidth="2" />

            {/* OS2 connections */}
            <path d="M645 180 L615 200" stroke="#3a4a8a" strokeWidth="2" />
            <path d="M645 280 L615 300" stroke="#c23a3a" strokeWidth="2" />
          </motion.g>

          {/* Legend at bottom */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <text x="170" y="470" textAnchor="middle" fill="#2a6a4a" fontSize="11">/dec-launch/os</text>
            <text x="630" y="470" textAnchor="middle" fill="#3a4a8a" fontSize="11">/dec-launch/os2</text>
          </motion.g>
        </svg>
      </div>

      <motion.p
        className="text-white/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Two solutions, each drawing from distinct yet complementary philosophies
      </motion.p>
    </div>
  );
}

function SlideMingeiIntro() {
  return (
    <div className="h-full flex items-center justify-center p-16" style={{ backgroundColor: '#f5e6d3' }}>
      <div className="max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-start gap-12">
            {/* Left: Visual */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Pottery-like shape */}
                <svg viewBox="0 0 200 240" className="w-48 h-60">
                  <defs>
                    <linearGradient id="mingeiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b6914" />
                      <stop offset="100%" stopColor="#6b4914" />
                    </linearGradient>
                  </defs>
                  {/* Simple bowl shape */}
                  <motion.path
                    d="M40 60 Q30 120 50 180 Q100 220 150 180 Q170 120 160 60 Q100 80 40 60"
                    fill="url(#mingeiGrad)"
                    initial={{ pathLength: 0, fillOpacity: 0 }}
                    animate={{ pathLength: 1, fillOpacity: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  {/* Simple pattern */}
                  <motion.circle
                    cx="100"
                    cy="130"
                    r="25"
                    fill="none"
                    stroke="#f5e6d3"
                    strokeWidth="3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 }}
                  />
                </svg>

                <motion.p
                  className="text-center text-[#5a4a2a]/60 text-sm mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Everyday beauty
                </motion.p>
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-7xl font-bold text-[#5a4a2a]">民藝</span>
                <div>
                  <h2 className="text-3xl font-bold text-[#5a4a2a]">Mingei</h2>
                  <p className="text-[#5a4a2a]/60">Folk Craft Movement</p>
                </div>
              </div>

              <blockquote className="text-2xl text-[#5a4a2a]/80 leading-relaxed font-light border-l-4 border-[#8b6914] pl-6 mb-8">
                "True beauty is found in objects made by unknown craftsmen for everyday use."
              </blockquote>

              <p className="text-[#5a4a2a]/70 text-lg mb-8">
                Founded by Yanagi Sōetsu in 1926, Mingei celebrates the beauty of ordinary,
                functional objects—rejecting both industrial mass production and elite fine art.
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#5a4a2a]/10 text-center">
                  <p className="text-2xl font-bold text-[#8b6914]">用</p>
                  <p className="text-[#5a4a2a]/60 text-sm mt-1">Utility</p>
                </div>
                <div className="p-4 bg-[#5a4a2a]/10 text-center">
                  <p className="text-2xl font-bold text-[#8b6914]">健</p>
                  <p className="text-[#5a4a2a]/60 text-sm mt-1">Health</p>
                </div>
                <div className="p-4 bg-[#5a4a2a]/10 text-center">
                  <p className="text-2xl font-bold text-[#8b6914]">素</p>
                  <p className="text-[#5a4a2a]/60 text-sm mt-1">Simplicity</p>
                </div>
              </div>

              <motion.div
                className="mt-8 p-4 bg-[#5a4a2a]/5 border border-[#8b6914]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-[#5a4a2a]/80 text-sm">
                  <span className="font-bold text-[#8b6914]">In Mino:</span> Our design system draws from Mingei's
                  principle that interfaces should feel crafted yet unpretentious—like well-worn tools
                  that work naturally.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideBoidsIntro() {
  return (
    <div className="h-full flex items-center justify-center p-12 bg-[#0a1a1a]">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-start gap-12">
            {/* Left: Boids visualization */}
            <div className="flex-shrink-0 w-80 h-80 relative">
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* School of fish using triangles */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30) + Math.sin(i * 0.5) * 15;
                  const cx = 150 + Math.cos(i * 0.8) * 60 + Math.sin(i) * 30;
                  const cy = 150 + Math.sin(i * 0.8) * 60 + Math.cos(i) * 30;
                  return (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: [0, Math.sin(i) * 5, 0],
                        y: [0, Math.cos(i) * 5, 0],
                      }}
                      transition={{
                        opacity: { delay: i * 0.05 },
                        x: { duration: 2 + i * 0.1, repeat: Infinity, ease: 'easeInOut' },
                        y: { duration: 2 + i * 0.1, repeat: Infinity, ease: 'easeInOut' },
                      }}
                    >
                      <polygon
                        points={`${cx},${cy-8} ${cx+5},${cy+8} ${cx-5},${cy+8}`}
                        fill="#2a6a4a"
                        transform={`rotate(${angle}, ${cx}, ${cy})`}
                      />
                    </motion.g>
                  );
                })}

                {/* Three rules visualization */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {/* Separation */}
                  <circle cx="70" cy="250" r="20" fill="none" stroke="#c23a3a" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="70" y="290" textAnchor="middle" fill="#c23a3a" fontSize="10">Separation</text>

                  {/* Alignment */}
                  <line x1="130" y1="245" x2="170" y2="245" stroke="#3a4a8a" strokeWidth="2" />
                  <polygon points="175,245 165,240 165,250" fill="#3a4a8a" />
                  <text x="150" y="290" textAnchor="middle" fill="#3a4a8a" fontSize="10">Alignment</text>

                  {/* Cohesion */}
                  <circle cx="230" cy="250" r="3" fill="#2a6a4a" />
                  <path d="M210 240 Q230 230 250 240 Q250 260 230 270 Q210 260 210 240" fill="none" stroke="#2a6a4a" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="230" y="290" textAnchor="middle" fill="#2a6a4a" fontSize="10">Cohesion</text>
                </motion.g>
              </svg>
            </div>

            {/* Right: Content */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-7xl font-bold text-[#2a6a4a]">群</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">Boids Algorithm</h2>
                  <p className="text-white/60">Craig Reynolds, 1986</p>
                </div>
              </div>

              <blockquote className="text-xl text-white/70 leading-relaxed font-light border-l-4 border-[#2a6a4a] pl-6 mb-8">
                "Complex global behavior can emerge from simple local rules."
              </blockquote>

              <p className="text-white/60 text-lg mb-8">
                Three simple rules create lifelike flocking: <strong className="text-white">separation</strong> (avoid crowding),
                <strong className="text-white"> alignment</strong> (match neighbors' heading), and
                <strong className="text-white"> cohesion</strong> (move toward center).
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white/5 border border-white/10">
                  <p className="text-[#2a6a4a] font-bold mb-1">Spatial Hashing</p>
                  <p className="text-white/50 text-sm">O(n) neighbor lookup for performance</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10">
                  <p className="text-[#2a6a4a] font-bold mb-1">Perlin Flow Fields</p>
                  <p className="text-white/50 text-sm">Organic movement through noise</p>
                </div>
              </div>

              <motion.div
                className="p-4 bg-[#2a6a4a]/10 border border-[#2a6a4a]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-white/80 text-sm">
                  <span className="font-bold text-[#2a6a4a]">In Mino:</span> Fish in the desktop OS use Boids
                  to create a living, breathing aquarium. Each fish follows simple rules,
                  yet the school moves as one—a digital allegory for emergent design.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideDitheringIntro() {
  return (
    <div className="h-full flex items-center justify-center p-12 bg-[#1a1a2a]">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-start gap-12">
            {/* Left: Dithering visualization */}
            <div className="flex-shrink-0 w-80">
              <svg viewBox="0 0 300 300" className="w-full">
                <defs>
                  {/* Sharp filter */}
                  <filter id="sharpFilter">
                    <feGaussianBlur stdDeviation="0" />
                  </filter>

                  {/* Dithered/blurred filter */}
                  <filter id="ditherFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                    <feGaussianBlur in="displaced" stdDeviation="1.5" />
                  </filter>
                </defs>

                {/* Label: Focused */}
                <text x="75" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">FOCUSED</text>

                {/* Sharp window */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <rect x="25" y="50" width="100" height="80" rx="4" fill="#3a4a8a" filter="url(#sharpFilter)" />
                  <rect x="25" y="50" width="100" height="20" rx="4" fill="#4a5a9a" />
                  <circle cx="40" cy="60" r="4" fill="#c23a3a" />
                  <circle cx="55" cy="60" r="4" fill="#c4a020" />
                  <circle cx="70" cy="60" r="4" fill="#2a6a4a" />
                  <rect x="35" y="85" width="80" height="8" rx="2" fill="white" fillOpacity="0.3" />
                  <rect x="35" y="100" width="60" height="6" rx="2" fill="white" fillOpacity="0.2" />
                  <rect x="35" y="112" width="70" height="6" rx="2" fill="white" fillOpacity="0.2" />
                </motion.g>

                {/* Label: Unfocused */}
                <text x="225" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">UNFOCUSED</text>

                {/* Dithered window */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  filter="url(#ditherFilter)"
                >
                  <rect x="175" y="50" width="100" height="80" rx="4" fill="#3a4a8a" fillOpacity="0.6" />
                  <rect x="175" y="50" width="100" height="20" rx="4" fill="#4a5a9a" fillOpacity="0.6" />
                  <circle cx="190" cy="60" r="4" fill="#c23a3a" fillOpacity="0.6" />
                  <circle cx="205" cy="60" r="4" fill="#c4a020" fillOpacity="0.6" />
                  <circle cx="220" cy="60" r="4" fill="#2a6a4a" fillOpacity="0.6" />
                  <rect x="185" y="85" width="80" height="8" rx="2" fill="white" fillOpacity="0.15" />
                  <rect x="185" y="100" width="60" height="6" rx="2" fill="white" fillOpacity="0.1" />
                  <rect x="185" y="112" width="70" height="6" rx="2" fill="white" fillOpacity="0.1" />
                </motion.g>

                {/* Filter chain diagram */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <rect x="30" y="170" width="240" height="110" rx="4" fill="white" fillOpacity="0.05" />
                  <text x="150" y="190" textAnchor="middle" fill="white" fontSize="10" fillOpacity="0.5">SVG FILTER CHAIN</text>

                  {/* feTurbulence */}
                  <rect x="45" y="205" width="50" height="25" rx="2" fill="#6a4a8a" />
                  <text x="70" y="222" textAnchor="middle" fill="white" fontSize="8">feTurbulence</text>

                  {/* Arrow */}
                  <line x1="100" y1="218" x2="120" y2="218" stroke="white" strokeWidth="1" />
                  <polygon points="125,218 118,214 118,222" fill="white" />

                  {/* feDisplacementMap */}
                  <rect x="130" y="205" width="55" height="25" rx="2" fill="#6a4a8a" />
                  <text x="157" y="222" textAnchor="middle" fill="white" fontSize="7">feDisplacement</text>

                  {/* Arrow */}
                  <line x1="190" y1="218" x2="210" y2="218" stroke="white" strokeWidth="1" />
                  <polygon points="215,218 208,214 208,222" fill="white" />

                  {/* feGaussianBlur */}
                  <rect x="220" y="205" width="45" height="25" rx="2" fill="#6a4a8a" />
                  <text x="242" y="222" textAnchor="middle" fill="white" fontSize="8">feBlur</text>

                  {/* Result label */}
                  <text x="150" y="260" textAnchor="middle" fill="#6a4a8a" fontSize="10">Organic depth without rasterization</text>
                </motion.g>
              </svg>
            </div>

            {/* Right: Content */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-7xl font-bold text-[#6a4a8a]">霧</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">SVG Dithering</h2>
                  <p className="text-white/60">Depth Through Controlled Noise</p>
                </div>
              </div>

              <blockquote className="text-xl text-white/70 leading-relaxed font-light border-l-4 border-[#6a4a8a] pl-6 mb-8">
                "The unfocused becomes atmosphere, drawing the eye to what matters."
              </blockquote>

              <p className="text-white/60 text-lg mb-8">
                Traditional blur feels artificial. Our SVG dithering filter uses
                <strong className="text-white"> fractal noise displacement</strong> to create
                organic depth—like looking through frosted glass or morning mist.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#6a4a8a]" />
                  <p className="text-white/70 text-sm"><strong className="text-white">feTurbulence:</strong> Generate Perlin noise texture</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#6a4a8a]" />
                  <p className="text-white/70 text-sm"><strong className="text-white">feDisplacementMap:</strong> Warp pixels using noise</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#6a4a8a]" />
                  <p className="text-white/70 text-sm"><strong className="text-white">feGaussianBlur:</strong> Soften the displaced result</p>
                </div>
              </div>

              <motion.div
                className="p-4 bg-[#6a4a8a]/10 border border-[#6a4a8a]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-white/80 text-sm">
                  <span className="font-bold text-[#6a4a8a]">In Mino:</span> Unfocused windows fade into the
                  background using this filter, creating visual hierarchy without harsh edges—like
                  the layered depth in traditional Japanese ink paintings.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideMacOSIntro() {
  return (
    <div className="h-full flex items-center justify-center p-12 bg-gradient-to-br from-[#2a3a4a] to-[#1a2a3a]">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-start gap-12">
            {/* Left: Desktop visualization */}
            <div className="flex-shrink-0 w-96">
              <div className="relative bg-[#1a1a2a] rounded-lg p-4 shadow-2xl">
                {/* Menu bar */}
                <div className="h-6 bg-[#2a2a3a] rounded-t flex items-center px-3 gap-4 mb-4">
                  <span className="text-white/80 text-xs font-bold">🍎</span>
                  <span className="text-white/60 text-xs">File</span>
                  <span className="text-white/60 text-xs">Edit</span>
                  <span className="text-white/60 text-xs">View</span>
                </div>

                {/* Windows */}
                <div className="relative h-48">
                  {/* Back window */}
                  <motion.div
                    className="absolute w-36 h-28 bg-[#3a4a5a] rounded shadow-lg"
                    style={{ top: 10, left: 10 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="h-5 bg-[#4a5a6a] rounded-t flex items-center px-2 gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#c23a3a]" />
                      <div className="w-2 h-2 rounded-full bg-[#c4a020]" />
                      <div className="w-2 h-2 rounded-full bg-[#2a6a4a]" />
                    </div>
                  </motion.div>

                  {/* Middle window */}
                  <motion.div
                    className="absolute w-40 h-32 bg-[#4a5a6a] rounded shadow-lg"
                    style={{ top: 30, left: 60 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="h-5 bg-[#5a6a7a] rounded-t flex items-center px-2 gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#c23a3a]" />
                      <div className="w-2 h-2 rounded-full bg-[#c4a020]" />
                      <div className="w-2 h-2 rounded-full bg-[#2a6a4a]" />
                    </div>
                  </motion.div>

                  {/* Front window (focused) */}
                  <motion.div
                    className="absolute w-44 h-36 bg-[#5a6a7a] rounded shadow-xl border border-white/20"
                    style={{ top: 50, left: 110 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="h-6 bg-[#6a7a8a] rounded-t flex items-center px-2 gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#c23a3a]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#c4a020]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2a6a4a]" />
                      <span className="text-white/80 text-xs ml-2">Terminal</span>
                    </div>
                    <div className="p-2">
                      <p className="text-[#2a6a4a] text-xs font-mono">$ mino start</p>
                      <p className="text-white/60 text-xs font-mono mt-1">Server running...</p>
                    </div>
                  </motion.div>
                </div>

                {/* Dock */}
                <motion.div
                  className="flex items-end justify-center gap-2 mt-4 h-12 bg-white/10 rounded-lg px-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {['📁', '🌐', '📝', '🎵', '⚙️'].map((icon, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm"
                    >
                      {icon}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-7xl font-bold text-white/80">窓</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">Desktop Paradigm</h2>
                  <p className="text-white/60">The Window as Metaphor</p>
                </div>
              </div>

              <blockquote className="text-xl text-white/70 leading-relaxed font-light border-l-4 border-white/30 pl-6 mb-8">
                "The desktop is not a workspace—it's a space for thought."
              </blockquote>

              <p className="text-white/60 text-lg mb-8">
                Since Xerox PARC in 1973, the <strong className="text-white">overlapping window</strong> metaphor
                has defined computing. Each window is a portal—draggable, stackable,
                a physical object in digital space.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white/5 border border-white/10">
                  <p className="text-white font-bold mb-1">Z-Index Stacking</p>
                  <p className="text-white/50 text-sm">Focus creates hierarchy through layering</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10">
                  <p className="text-white font-bold mb-1">Draggable Windows</p>
                  <p className="text-white/50 text-sm">User controls spatial organization</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10">
                  <p className="text-white font-bold mb-1">Traffic Lights</p>
                  <p className="text-white/50 text-sm">Close, minimize, maximize—universal</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10">
                  <p className="text-white font-bold mb-1">Persistent Dock</p>
                  <p className="text-white/50 text-sm">Quick access to frequent tools</p>
                </div>
              </div>

              <motion.div
                className="p-4 bg-white/5 border border-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-white/80 text-sm">
                  <span className="font-bold text-white">In Mino:</span> The OS page recreates this paradigm
                  with Tanaka aesthetics—traffic light buttons in his palette, windows as zen frames,
                  the dock as a calligraphic brush rest.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// SOLUTION SLIDES
// ============================================

function SlideOSSolution() {
  const features = [
    { icon: '窓', name: 'Windows', desc: 'Draggable, stackable, z-indexed', color: '#4a6a8a' },
    { icon: '民', name: 'Mingei Style', desc: 'Craft-inspired, warm materials', color: '#8b6914' },
    { icon: '群', name: 'Boids Fish', desc: 'Living, breathing background', color: '#2a6a4a' },
    { icon: '霧', name: 'SVG Dithering', desc: 'Organic depth & focus', color: '#6a4a8a' },
  ];

  return (
    <div className="h-full flex items-center justify-center p-12 bg-gradient-to-br from-[#1a2a3a] to-[#0a1a2a]">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-24 h-20">
              {/* Mini desktop visual */}
              <div className="absolute inset-0 bg-[#2a3a4a] rounded-lg border border-[#2a6a4a]">
                <div className="h-3 bg-[#3a4a5a] rounded-t-lg flex items-center px-1 gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c23a3a]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c4a020]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2a6a4a]" />
                </div>
              </div>
              <motion.div
                className="absolute bottom-1 left-2 text-sm"
                animate={{ x: [0, 50, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                🐟
              </motion.div>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-white">OS</h2>
              <p className="text-[#2a6a4a] text-lg">Desktop Paradigm Solution</p>
              <p className="text-white/40 text-sm font-mono">/dec-launch/os</p>
            </div>
          </div>

          {/* Philosophy */}
          <blockquote className="text-xl text-white/70 leading-relaxed font-light border-l-4 border-[#2a6a4a] pl-6 mb-10">
            "A digital aquarium where windows float like lily pads on water, and fish swim through your workspace."
          </blockquote>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-6 bg-white/[0.03] border border-white/10 rounded-lg"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white"
                    style={{ backgroundColor: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{f.name}</h3>
                    <p className="text-white/50 text-sm">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technical stack */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-white/30 text-sm">Tech:</span>
            {['React', 'Framer Motion', 'SVG Filters', 'Boids Algorithm', 'Perlin Noise'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white/5 rounded text-white/60 text-xs">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideOS2Solution() {
  const features = [
    { icon: '遊', name: 'PS4 Navigation', desc: 'Horizontal tile menu', color: '#3a4a8a' },
    { icon: '田', name: 'Tanaka Icons', desc: 'Kanji as bold geometry', color: '#c23a3a' },
    { icon: '拡', name: 'Expanded Panels', desc: 'Content-first focus', color: '#4a5a6a' },
    { icon: '音', name: 'Ambient Motion', desc: 'Subtle, breathing UI', color: '#2a4a5a' },
  ];

  return (
    <div className="h-full flex items-center justify-center p-12 bg-[#0a0a12]">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            {/* Mini PS4-style tiles */}
            <div className="flex items-end gap-1">
              {['魚', '端', '書'].map((kanji, i) => (
                <motion.div
                  key={kanji}
                  className={`flex items-center justify-center rounded ${
                    i === 0 ? 'w-12 h-12 bg-[#3a4a8a] border border-white/30' : 'w-8 h-8 bg-white/10'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <span className={`${i === 0 ? 'text-lg text-white' : 'text-xs text-white/50'}`}>
                    {kanji}
                  </span>
                </motion.div>
              ))}
            </div>
            <div>
              <h2 className="text-5xl font-bold text-white">OS2</h2>
              <p className="text-[#3a4a8a] text-lg">Console Interface Solution</p>
              <p className="text-white/40 text-sm font-mono">/dec-launch/os2</p>
            </div>
          </div>

          {/* Philosophy */}
          <blockquote className="text-xl text-white/70 leading-relaxed font-light border-l-4 border-[#3a4a8a] pl-6 mb-10">
            "The zen of PlayStation meets Tanaka's geometric poetry—bold tiles, kanji icons, and content that breathes."
          </blockquote>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-6 bg-white/[0.03] border border-white/10 rounded-lg"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white"
                    style={{ backgroundColor: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{f.name}</h3>
                    <p className="text-white/50 text-sm">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technical stack */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-white/30 text-sm">Tech:</span>
            {['React', 'Framer Motion', 'Keyboard Nav', 'Scroll Wheel', 'Focus States'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white/5 rounded text-white/60 text-xs">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideComparison() {
  const comparisons = [
    { aspect: 'Navigation', os: 'Drag windows, click dock', os2: 'Arrow keys, large tiles' },
    { aspect: 'Background', os: 'Animated fish (Boids)', os2: 'Static geometric patterns' },
    { aspect: 'Focus Model', os: 'Z-index stacking + dithering', os2: 'Scale + brightness + border' },
    { aspect: 'Aesthetic', os: 'Warm, organic, fluid', os2: 'Dark, geometric, bold' },
    { aspect: 'Interaction', os: 'Mouse/touch-first', os2: 'Keyboard/controller-first' },
    { aspect: 'Content', os: 'Multiple visible windows', os2: 'One expanded at a time' },
  ];

  return (
    <div className="h-full flex items-center justify-center p-12 bg-[#0a0a0a]">
      <div className="max-w-5xl w-full">
        <motion.h2
          className="text-4xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          OS vs OS2 Comparison
        </motion.h2>

        <div className="relative">
          {/* Headers */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div />
            <div className="text-center">
              <span className="text-[#2a6a4a] font-bold text-lg">OS</span>
              <p className="text-white/40 text-xs">Desktop</p>
            </div>
            <div className="text-center">
              <span className="text-[#3a4a8a] font-bold text-lg">OS2</span>
              <p className="text-white/40 text-xs">Console</p>
            </div>
          </div>

          {/* Comparison rows */}
          {comparisons.map((row, i) => (
            <motion.div
              key={row.aspect}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="grid grid-cols-3 gap-4 py-3 border-b border-white/10"
            >
              <div className="text-white/60 font-medium text-sm flex items-center">
                {row.aspect}
              </div>
              <div className="text-white/80 text-sm bg-[#2a6a4a]/10 px-3 py-2 rounded">
                {row.os}
              </div>
              <div className="text-white/80 text-sm bg-[#3a4a8a]/10 px-3 py-2 rounded">
                {row.os2}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/40 text-sm">
            Both solutions share the Japanese design principle of <span className="text-white">間 (Ma)</span>—
            deliberate space that creates meaning
          </p>
        </motion.div>
      </div>
    </div>
  );
}
