import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const BlogSection = () => {
  // Get the 3 most recent posts
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-[15%] w-2 h-2 bg-primary/20 rounded-full animate-float" />
        <div className="absolute bottom-20 left-[10%] w-1.5 h-1.5 bg-primary-purple/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">
            From Our Blog
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Latest Insights & Tips
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay ahead with expert advice on AI fashion photography, e-commerce strategies, and visual marketing trends.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {recentPosts.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className={`opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="group h-full bg-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 overflow-hidden hover:-translate-y-2">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-5 md:p-6">
                  <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mt-3 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.published_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.read_time}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/blog">
            <Button 
              variant="outline" 
              size="lg"
              className="group transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/5"
            >
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};