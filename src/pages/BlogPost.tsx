import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Calendar, Clock, ArrowLeft, Twitter, Facebook, Linkedin, Link2 } from "lucide-react";
import { getPostBySlug, getRelatedPosts, BlogPost as BlogPostType } from "@/data/blogPosts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;
  const relatedPosts = slug ? getRelatedPosts(slug, 3) : [];

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | FashionAI Blog`;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', post.excerpt);

      // Update OG tags
      const updateOrCreateMeta = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      updateOrCreateMeta('og:title', post.title);
      updateOrCreateMeta('og:description', post.excerpt);
      updateOrCreateMeta('og:image', post.featured_image_url);
      updateOrCreateMeta('og:type', 'article');
    }

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
      return;
    }

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  // Parse markdown-like content to HTML
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-foreground mt-10 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-foreground mt-8 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold text-foreground mt-6 mb-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      } else if (trimmedLine.startsWith('- ')) {
        currentList.push(trimmedLine.replace('- ', ''));
      } else if (trimmedLine.length > 0) {
        flushList();
        elements.push(
          <p key={index} className="text-muted-foreground leading-relaxed mb-4">
            {trimmedLine}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground">
            FashionAI
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link to="/blog" className="text-foreground font-medium">Blog</Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
            <Link to="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Image */}
      <div className="w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* Author Info */}
          <div className="flex items-center gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-foreground">{post.author.name}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.published_date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.read_time}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-4">Share this article</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('twitter')}
              className="hover:bg-primary/10 hover:border-primary"
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('facebook')}
              className="hover:bg-primary/10 hover:border-primary"
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('linkedin')}
              className="hover:bg-primary/10 hover:border-primary"
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('copy')}
              className="hover:bg-primary/10 hover:border-primary"
            >
              <Link2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <Card className="group h-full bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-5">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {relatedPost.read_time}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Fashion Photography?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start creating professional product images with AI in minutes.
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} FashionAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
