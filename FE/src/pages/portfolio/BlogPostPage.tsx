import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Tag, Star, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { portfolioAPI } from '../../services/api';
import type { BlogPost } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const BlogPostPage: React.FC = () => {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || !slug) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await portfolioAPI.getBlogPost(username, slug);
        setPost(data);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setError('Post not found.');
        } else {
          setError('Failed to load this post.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username, slug]);

  if (loading) return <Loading label="Loading article..." />;
  if (error || !post) return <ErrorMessage title="Post Not Found" message={error || 'Post not found'} />;

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const readTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <Link
            to={`/${username}/blog`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-content-muted
                       hover:text-accent transition-colors mb-10 group rounded-md
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                       focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </Link>

          {/* Cover image */}
          {post.featured_image && (
            <div className="rounded-[1.75rem] overflow-hidden mb-10 h-72 md:h-96 bg-surface-muted
                            border border-line shadow-[var(--glass-shadow)]">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {post.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                               bg-accent/10 text-accent border border-accent/20
                               text-xs font-semibold">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
            {post.tags_list.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                           text-content-muted
                           bg-[color-mix(in_oklch,var(--text)_5%,transparent)]
                           border border-[color-mix(in_oklch,var(--text)_8%,transparent)]"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] text-content mb-6">
            {post.title}
          </h1>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-content-muted mb-10 pb-8 border-b border-line">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {dateStr}
            </span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-content-muted/50" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-content-muted/50" />
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} views
            </span>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg md:text-xl text-content-muted font-medium leading-relaxed mb-10 max-w-[65ch]">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-[65ch]
                       prose-headings:font-semibold prose-headings:text-content prose-headings:tracking-tight
                       prose-p:text-content-muted prose-li:text-content-muted prose-hr:border-line
                       prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-content
                       prose-code:bg-[color-mix(in_oklch,var(--text)_6%,transparent)] prose-code:text-content
                       prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5
                       prose-pre:bg-[#1d1d1f] prose-pre:text-[#f5f5f7] prose-pre:rounded-xl
                       prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-content-muted
                       prose-img:rounded-2xl
                       dark:prose-invert"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-line">
            <Link
              to={`/${username}/blog`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                         bg-accent text-accent-fg text-sm font-semibold
                         transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5
                         shadow-[0_1px_2px_color-mix(in_oklch,var(--accent)_30%,transparent)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                         focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <ArrowLeft className="w-4 h-4" />
              All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
