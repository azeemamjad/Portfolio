from urllib.parse import quote

from django.contrib import admin
from django.db.models import Count, Q
from django.urls import reverse
from django.utils import timezone
from django.utils.html import escape, format_html
from django.utils.safestring import mark_safe
from django.utils.text import Truncator
from django.utils.timesince import timesince

from portfolio.models import ContactMessage


class ReadStatusFilter(admin.SimpleListFilter):
    title = 'status'
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            ('unread', 'Unread'),
            ('read', 'Read'),
            ('starred', 'Starred'),
        ]

    def queryset(self, request, queryset):
        if self.value() == 'unread':
            return queryset.filter(is_read=False)
        if self.value() == 'read':
            return queryset.filter(is_read=True)
        if self.value() == 'starred':
            return queryset.filter(is_starred=True)
        return queryset


class RecentFilter(admin.SimpleListFilter):
    title = 'received'
    parameter_name = 'recent'

    def lookups(self, request, model_admin):
        return [
            ('today', 'Today'),
            ('week', 'This week'),
        ]

    def queryset(self, request, queryset):
        now = timezone.now()
        if self.value() == 'today':
            return queryset.filter(created_at__date=now.date())
        if self.value() == 'week':
            return queryset.filter(created_at__gte=now - timezone.timedelta(days=7))
        return queryset


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    change_list_template = 'admin/portfolio/contactmessage/change_list.html'
    change_form_template = 'admin/portfolio/contactmessage/change_form.html'

    list_display = [
        'star_toggle',
        'status_badge',
        'sender_block',
        'subject_preview',
        'portfolio_badge',
        'received_at',
    ]
    list_filter = [ReadStatusFilter, RecentFilter, 'portfolio', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message', 'admin_notes']
    date_hierarchy = 'created_at'
    list_per_page = 25
    actions = ['mark_as_read', 'mark_as_unread', 'mark_as_starred', 'unstar_messages']

    readonly_fields = [
        'message_preview',
        'reply_actions',
        'created_at',
        'read_at',
    ]

    fieldsets = (
        ('Inbox actions', {
            'fields': ('message_preview', 'reply_actions'),
        }),
        ('Sender', {
            'fields': ('name', 'email', 'portfolio'),
        }),
        ('Message details', {
            'fields': ('subject', 'message'),
        }),
        ('Your workflow', {
            'fields': ('is_read', 'is_starred', 'admin_notes'),
            'classes': ('cm-workflow',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'read_at'),
            'classes': ('collapse',),
        }),
    )

    class Media:
        css = {
            'all': ('portfolio/admin/contact_messages.css',),
        }

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('portfolio')

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        qs = self.get_queryset(request)
        today = timezone.localdate()
        extra_context['cm_stats'] = {
            'total': qs.count(),
            'unread': qs.filter(is_read=False).count(),
            'starred': qs.filter(is_starred=True).count(),
            'today': qs.filter(created_at__date=today).count(),
        }
        extra_context['cm_by_portfolio'] = (
            qs.values('portfolio__username', 'portfolio__name')
            .annotate(
                total=Count('id'),
                unread=Count('id', filter=Q(is_read=False)),
            )
            .order_by('-unread', '-total')[:6]
        )
        return super().changelist_view(request, extra_context)

    def change_view(self, request, object_id, form_url='', extra_context=None):
        if object_id:
            obj = self.get_object(request, object_id)
            if obj and not obj.is_read:
                obj.is_read = True
                obj.read_at = timezone.now()
                obj.save(update_fields=['is_read', 'read_at'])
        extra_context = extra_context or {}
        extra_context['cm_show_inbox_banner'] = True
        return super().change_view(request, object_id, form_url, extra_context)

    @admin.display(description='')
    def star_toggle(self, obj):
        icon = '★' if obj.is_starred else '☆'
        css = 'cm-star cm-star--on' if obj.is_starred else 'cm-star'
        return format_html('<span class="{}" title="{}">{}</span>', css, 'Starred' if obj.is_starred else 'Not starred', icon)

    @admin.display(description='Status', ordering='is_read')
    def status_badge(self, obj):
        if not obj.is_read:
            return mark_safe('<span class="cm-badge cm-badge--unread">New</span>')
        return mark_safe('<span class="cm-badge cm-badge--read">Read</span>')

    @admin.display(description='From', ordering='name')
    def sender_block(self, obj):
        return format_html(
            '<div class="cm-sender">'
            '<span class="cm-sender__name">{}</span>'
            '<a class="cm-sender__email" href="mailto:{}">{}</a>'
            '</div>',
            escape(obj.name),
            obj.email,
            escape(obj.email),
        )

    @admin.display(description='Subject', ordering='subject')
    def subject_preview(self, obj):
        subject = obj.subject or '(No subject)'
        preview = Truncator(obj.message).chars(72)
        weight = '' if obj.is_read else ' cm-subject--unread'
        return format_html(
            '<div class="cm-subject{}">'
            '<span class="cm-subject__title">{}</span>'
            '<span class="cm-subject__preview">{}</span>'
            '</div>',
            weight,
            escape(subject),
            escape(preview),
        )

    @admin.display(description='Portfolio', ordering='portfolio__username')
    def portfolio_badge(self, obj):
        label = obj.portfolio.name or obj.portfolio.username
        return format_html(
            '<span class="cm-portfolio" title="{}">@{}</span>',
            escape(label),
            escape(obj.portfolio.username),
        )

    @admin.display(description='Received', ordering='created_at')
    def received_at(self, obj):
        return format_html(
            '<span class="cm-time" title="{}">{} ago</span>',
            timezone.localtime(obj.created_at).strftime('%b %d, %Y %H:%M'),
            timesince(obj.created_at),
        )

    @admin.display(description='Message')
    def message_preview(self, obj):
        subject = escape(obj.subject or 'No subject')
        body = escape(obj.message).replace('\n', '<br>')
        return mark_safe(
            f'<div class="cm-detail-card">'
            f'<div class="cm-detail-card__header">'
            f'<span class="cm-detail-card__label">Subject</span>'
            f'<h3 class="cm-detail-card__subject">{subject}</h3>'
            f'</div>'
            f'<div class="cm-detail-card__body">{body}</div>'
            f'</div>'
        )

    @admin.display(description='Quick actions')
    def reply_actions(self, obj):
        subject = quote(f"Re: {obj.subject}" if obj.subject else 'Re: Your message')
        body = quote(f"\n\n---\nOn {obj.created_at:%b %d, %Y}, {obj.name} wrote:\n{obj.message}")
        mailto = f'mailto:{obj.email}?subject={subject}&body={body}'
        inbox_url = reverse('admin:portfolio_contactmessage_changelist')
        return format_html(
            '<div class="cm-action-bar">'
            '<a class="cm-btn cm-btn--primary" href="{}">✉ Reply via email</a>'
            '<a class="cm-btn cm-btn--ghost" href="{}" target="_blank" rel="noopener">↗ Open mail client</a>'
            '<a class="cm-btn cm-btn--secondary" href="{}">← Back to inbox</a>'
            '</div>',
            mailto,
            mailto,
            inbox_url,
        )

    @admin.action(description='Mark selected as read')
    def mark_as_read(self, request, queryset):
        count = queryset.update(is_read=True, read_at=timezone.now())
        self.message_user(request, f'{count} message(s) marked as read.')

    @admin.action(description='Mark selected as unread')
    def mark_as_unread(self, request, queryset):
        count = queryset.update(is_read=False, read_at=None)
        self.message_user(request, f'{count} message(s) marked as unread.')

    @admin.action(description='Star selected messages')
    def mark_as_starred(self, request, queryset):
        count = queryset.update(is_starred=True)
        self.message_user(request, f'{count} message(s) starred.')

    @admin.action(description='Remove star from selected')
    def unstar_messages(self, request, queryset):
        count = queryset.update(is_starred=False)
        self.message_user(request, f'{count} message(s) unstarred.')
