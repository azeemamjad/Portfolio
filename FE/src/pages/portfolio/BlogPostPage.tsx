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
  const { username, postId } = useParams<{ username: string; postId: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || !postId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await portfolioAPI.getBlogPost(username, Number(postId));
        setPost(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Post not found.');
        } else {
          setError('Failed to load this post.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username, postId]);

  if (loading) return <Loading />;
  if (error || !post) return <ErrorMessage message={error || 'Post not found'} />;

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
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500
                       hover:text-orange-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </Link>

          {/* Cover image */}
          {post.featured_image && (
            <div className="rounded-2xl overflow-hidden mb-8 h-72 md:h-96 bg-neutral-100">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                               bg-orange-100 text-orange-600 text-xs font-semibold">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
            {post.tags_list.map((tag, i) => (
              <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                         bg-neutral-100 text-neutral-500 text-xs font-medium">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Stats row */}
          <div className="flex items-center gap-5 text-sm text-neutral-400 mb-8 pb-8 border-b border-neutral-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} views
            </span>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-neutral-600 leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="prose prose-neutral prose-headings:font-black prose-headings:text-neutral-900
                       prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                       prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                       prose-code:text-orange-700 prose-code:font-mono prose-code:text-sm
                       prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:rounded-xl
                       prose-blockquote:border-l-orange-400 prose-blockquote:text-neutral-500
                       prose-img:rounded-xl prose-img:shadow-md
                       max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-neutral-100">
            <Link
              to={`/${username}/blog`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                         bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold
                         transition-all shadow-md shadow-orange-900/30 hover:-translate-y-0.5"
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
