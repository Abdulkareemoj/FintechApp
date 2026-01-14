import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import testimonialImage from "/testimonial-1.jpg";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "I used to ignore anything finance-related, but now I actually enjoy checking my progress. It's weirdly satisfying.",
      author: "Jamie Root",
      role: "Marketing Professional",
      company: "Grapho",
      image: testimonialImage,
    },
    {
      quote:
        "Finova helped me save for my first home. The goal tracking feature kept me motivated every step of the way.",
      author: "Alex Chen",
      role: "Software Engineer",
      company: "TechFlow",
      image: testimonialImage,
    },
    {
      quote:
        "Finally, an app that makes investing accessible. I started with just $50 and now I've built a real portfolio.",
      author: "Maria Santos",
      role: "Freelance Designer",
      company: "Independent",
      image: testimonialImage,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
            Testimonials
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Money talk, from
              <br />
              <span className="italic-accent">real</span> people
            </h2>
            <p className="text-muted-foreground max-w-md">
              From everyday wins to big milestones—here's how we've helped others take control of their money.
            </p>
          </div>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-8 items-center"
        >
          {/* Controls */}
          <div className="flex items-center gap-4 order-2 lg:order-1">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Quote Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-3xl p-8 shadow-card order-1 lg:order-2"
          >
            <Quote className="w-8 h-8 text-primary/20 mb-4" />
            <blockquote className="text-lg lg:text-xl text-foreground leading-relaxed mb-6">
              "{current.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <img
                src={current.image}
                alt={current.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-foreground">{current.author}</div>
                <div className="text-sm text-muted-foreground">{current.role}</div>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                @ {current.company}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
