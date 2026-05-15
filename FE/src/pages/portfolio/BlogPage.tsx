import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Clock, Tag, Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { portfolioAPI } from '../../services/api';
import type { BlogPost } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const PAGE_SIZE = 6;

const BlogPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await portfolioAPI.getBlogPosts(username, page);
        setPosts(data.results);
        setTotalCount(data.count);
      } catch {
        setError('Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="section-padding">
      <div className="container-custom">

        {/* Header */}
        <div className="section-header mb-12">
          <span className="section-label">Writing</span>
          <h1 className="heading-secondary text-neutral-900">Blog</h1>
          <div className="section-underline" />
          <p className="text-neutral-500 mt-4 max-w-xl mx-auto text-sm">
            Thoughts, tutorials, and insights on software development.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg font-medium">No posts yet</p>
            <p className="text-neutral-400 text-sm mt-1">Check back soon for new content.</p>
          </div>
        ) : (
          <>
            {/* Posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} username={username!} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center
                             text-neutral-500 hover:border-orange-400 hover:text-orange-600
                             disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-neutral-500">
                  Page <span className="font-semibold text-neutral-900">{page}</span> of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center
                             text-neutral-500 hover:border-orange-400 hover:text-orange-600
                             disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface BlogCardProps {
  post: BlogPost;
  username: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, username }) => {
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const readTime = Math.max(1, Math.ceil((post.content || post.excerpt || '').split(/\s+/).length / 200));

  return (
    <Link
      to={`/${username}/blog/${post.id}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1"
    >
      {/* Cover image */}
      {post.featured_image ? (
        <div className="h-44 overflow-hidden bg-neutral-100 flex-shrink-0">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-44 flex-shrink-0 bg-gradient-to-br from-orange-50 to-amber-50
                        flex items-center justify-center border-b border-neutral-100">
          <BookOpen className="w-10 h-10 text-orange-200" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.is_featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                             bg-orange-100 text-orange-600 text-[11px] font-semibold">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {post.tags_list.slice(0, 2).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                       bg-neutral-100 text-neutral-500 text-[11px] font-medium">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-neutral-900 leading-snug mb-2
                       group-hover:text-orange-600 transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-400">
          <span>{dateStr}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime} min read
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPage;
