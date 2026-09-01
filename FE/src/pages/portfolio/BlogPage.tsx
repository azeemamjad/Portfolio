import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Clock, Tag, Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { portfolioAPI } from '../../services/api';
import type { BlogPost } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHero from '../../components/common/PageHero';

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

  if (loading) return <Loading label="Loading blog..." />;
  if (error) return <ErrorMessage title="Error Loading Blog" message={error} />;

  return (
    <>
      <PageHero
        label="Writing"
        title="My"
        highlight="Blogs"
        description="Thoughts, tutorials, and insights on software development."
      />
      <div className="page-content-section">
        <div className="container-custom mt-8 md:mt-10">
          {posts.length === 0 ? (
            <div className="text-center py-24 md:py-28">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center
                              bg-[color-mix(in_oklch,var(--text)_5%,transparent)]
                              border border-[color-mix(in_oklch,var(--text)_8%,transparent)]">
                <BookOpen className="w-7 h-7 text-content-muted" />
              </div>
              <p className="text-xl font-semibold text-content">No posts yet</p>
              <p className="text-content-muted text-sm mt-2">Check back soon for new content.</p>
            </div>
          ) : (
            <>
              {/* Featured story */}
              <FeaturedCard post={posts[0]} username={username!} />

              {/* Posts grid */}
              {posts.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 md:mt-8">
                  {posts.slice(1).map((post) => (
                    <BlogCard key={post.id} post={post} username={username!} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-14">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="w-9 h-9 rounded-full border border-line bg-transparent flex items-center justify-center
                               text-content-muted hover:border-accent/40 hover:text-accent
                               disabled:opacity-40 disabled:cursor-not-allowed
                               disabled:hover:border-line disabled:hover:text-content-muted
                               transition-all duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                               focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-content-muted">
                    Page <span className="font-semibold text-content">{page}</span> of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className="w-9 h-9 rounded-full border border-line bg-transparent flex items-center justify-center
                               text-content-muted hover:border-accent/40 hover:text-accent
                               disabled:opacity-40 disabled:cursor-not-allowed
                               disabled:hover:border-line disabled:hover:text-content-muted
                               transition-all duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                               focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

interface BlogCardProps {
  post: BlogPost;
  username: string;
}

const formatDate = (post: BlogPost): string =>
  post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const readTimeOf = (post: BlogPost): number =>
  Math.max(1, Math.ceil((post.content || post.excerpt || '').split(/\s+/).length / 200));

/* Large lead story — Apple editorial featured card */
const FeaturedCard: React.FC<BlogCardProps> = ({ post, username }) => {
  return (
    <Link
      to={`/${username}/blog/${post.slug}`}
      className="group flex flex-col md:flex-row overflow-hidden rounded-[1.75rem]
                 bg-[var(--glass-bg)] backdrop-blur-xl backdrop-saturate-150
                 border border-[var(--glass-border)] shadow-[var(--glass-shadow)]
                 transition-all duration-300
                 hover:-translate-y-1
                 hover:border-[color-mix(in_oklch,var(--accent)_32%,var(--glass-border))]
                 hover:shadow-[var(--glass-shadow-elevated)]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {/* Cover image */}
      {post.featured_image ? (
        <div className="md:w-1/2 shrink-0 h-56 md:h-auto overflow-hidden bg-surface-muted
                        border-b md:border-b-0 md:border-r border-line">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
        </div>
      ) : (
        <div className="md:w-1/2 shrink-0 h-56 md:h-auto flex items-center justify-center bg-surface-muted
                        border-b md:border-b-0 md:border-r border-line">
          <BookOpen className="w-12 h-12 text-content-muted/40" />
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col p-6 md:p-8">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {post.is_featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                             bg-accent/10 text-accent border border-accent/20
                             text-[11px] font-semibold">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {post.tags_list.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                         text-content-muted
                         bg-[color-mix(in_oklch,var(--text)_5%,transparent)]
                         border border-[color-mix(in_oklch,var(--text)_8%,transparent)]"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-content leading-[1.15]
                       mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-content-muted text-base leading-relaxed line-clamp-3 mb-6">
            {post.excerpt}
          </p>
        )}

        {/* Meta + read more */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 border-t border-line text-xs text-content-muted">
          <span>{formatDate(post)}</span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-content-muted/50" />
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTimeOf(post)} min read
          </span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-content-muted/50" />
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-accent">
            Read story
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* Refined grid card */
const BlogCard: React.FC<BlogCardProps> = ({ post, username }) => {
  return (
    <Link
      to={`/${username}/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl
                 bg-[var(--glass-bg)] backdrop-blur-xl backdrop-saturate-150
                 border border-[var(--glass-border)] shadow-[var(--glass-shadow)]
                 transition-all duration-300
                 hover:-translate-y-1
                 hover:border-[color-mix(in_oklch,var(--accent)_32%,var(--glass-border))]
                 hover:shadow-[var(--glass-shadow-elevated)]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {/* Cover image */}
      {post.featured_image ? (
        <div className="h-44 shrink-0 overflow-hidden bg-surface-muted border-b border-line">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      ) : (
        <div className="h-44 shrink-0 flex items-center justify-center bg-surface-muted border-b border-line">
          <BookOpen className="w-10 h-10 text-content-muted/40" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 min-w-0">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.is_featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                             bg-accent/10 text-accent border border-accent/20
                             text-[11px] font-semibold">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {post.tags_list.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
                         text-content-muted
                         bg-[color-mix(in_oklch,var(--text)_5%,transparent)]
                         border border-[color-mix(in_oklch,var(--text)_8%,transparent)]"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-content leading-snug mb-2
                       group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-content-muted text-sm leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-line text-xs text-content-muted">
          <span>{formatDate(post)}</span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-content-muted/50" />
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTimeOf(post)} min read
          </span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-content-muted/50" />
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPage;
