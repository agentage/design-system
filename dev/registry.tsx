import type { ComponentType } from 'react';

import { Demo as AccordionDemo } from './demos/accordion';
import { Demo as AlertDemo } from './demos/alert';
import { Demo as AlertDialogDemo } from './demos/alert-dialog';
import { Demo as AvatarDemo } from './demos/avatar';
import { Demo as BadgeDemo } from './demos/badge';
import { Demo as BreadcrumbDemo } from './demos/breadcrumb';
import { Demo as ButtonDemo } from './demos/button';
import { Demo as CardDemo } from './demos/card';
import { Demo as CheckboxDemo } from './demos/checkbox';
import { Demo as ChipDemo } from './demos/chip';
import { Demo as CodeBlockDemo } from './demos/code-block';
import { Demo as CollapsibleDemo } from './demos/collapsible';
import { Demo as ComboboxDemo } from './demos/combobox';
import { Demo as CommandDemo } from './demos/command';
import { Demo as ContextMenuDemo } from './demos/context-menu';
import { Demo as CopyButtonDemo } from './demos/copy-button';
import { Demo as DangerZoneDemo } from './demos/danger-zone';
import { Demo as DataTableDemo } from './demos/data-table';
import { Demo as DatePickerDemo } from './demos/date-picker';
import { Demo as DocSidebarDemo } from './demos/doc-sidebar';
import { Demo as DonutCardDemo } from './demos/donut-card';
import { Demo as DropdownMenuDemo } from './demos/dropdown-menu';
import { Demo as EmptyStateDemo } from './demos/empty-state';
import { Demo as EntityListDemo } from './demos/entity-list';
import { Demo as FooterDemo } from './demos/footer';
import { Demo as FunnelCardDemo } from './demos/funnel-card';
import { Demo as GaugeCardDemo } from './demos/gauge-card';
import { Demo as HeadingDemo } from './demos/heading';
import { Demo as HeatmapCardDemo } from './demos/heatmap-card';
import { Demo as HoverCardDemo } from './demos/hover-card';
import { Demo as InputDemo } from './demos/input';
import { Demo as KbdDemo } from './demos/kbd';
import { Demo as LabelDemo } from './demos/label';
import { Demo as LoadingDemo } from './demos/loading';
import { Demo as MarkdownDemo } from './demos/markdown';
import { Demo as ModalDemo } from './demos/modal';
import { Demo as MultiStatCardDemo } from './demos/multi-stat-card';
import { Demo as OverlayPortalsDemo } from './demos/overlay-portals';
import { Demo as PageHeaderDemo } from './demos/page-header';
import { Demo as PaginationDemo } from './demos/pagination';
import { Demo as PopoverDemo } from './demos/popover';
import { Demo as ProgressDemo } from './demos/progress';
import { Demo as ProseDemo } from './demos/prose';
import { Demo as RadioGroupDemo } from './demos/radio-group';
import { Demo as RankedListCardDemo } from './demos/ranked-list-card';
import { Demo as ResizableDemo } from './demos/resizable';
import { Demo as ScoreCardDemo } from './demos/score-card';
import { Demo as ScrollAreaDemo } from './demos/scroll-area';
import { Demo as SectionDemo } from './demos/section';
import { Demo as SeparatorDemo } from './demos/separator';
import { Demo as SheetDemo } from './demos/sheet';
import { Demo as SidebarDemo } from './demos/sidebar';
import { Demo as SliderDemo } from './demos/slider';
import { Demo as StatCardDemo } from './demos/stat-card';
import { Demo as StatCardAdvancedDemo } from './demos/stat-card-advanced';
import { Demo as StatusDotDemo } from './demos/status-dot';
import { Demo as TableMachinesDemo } from './demos/table-machines';
import { Demo as TableRunsDemo } from './demos/table-runs';
import { Demo as TabsDemo } from './demos/tabs';
import { Demo as TabsUnderlineDemo } from './demos/tabs-underline';
import { Demo as ToastDemo } from './demos/toast';
import { Demo as ToggleGroupDemo } from './demos/toggle-group';
import { Demo as TopBarDemo } from './demos/top-bar';
import { Demo as TooltipDemo } from './demos/tooltip';
import { Demo as UsageMeterDemo } from './demos/usage-meter';

export interface DemoEntry {
  /** Shown above the demo when a component page carries more than one. */
  title?: string;
  Component: ComponentType;
}

export interface ComponentEntry {
  slug: string;
  name: string;
  description: string;
  /** Public exports documented on the page (drives prop tables + import snippet). */
  exports: string[];
  demos: DemoEntry[];
}

export interface CategoryEntry {
  slug: string;
  label: string;
  description: string;
  components: ComponentEntry[];
}

export const CATEGORIES: CategoryEntry[] = [
  {
    slug: 'foundations',
    label: 'Foundations',
    description: 'The primitives every other page builds on.',
    components: [
      {
        slug: 'button',
        name: 'Button',
        description: 'Six variants and eight sizes, with an asChild slot for links.',
        exports: ['Button'],
        demos: [{ Component: ButtonDemo }],
      },
      {
        slug: 'badge',
        name: 'Badge',
        description: 'Compact status label in the semantic colour vocabulary.',
        exports: ['Badge'],
        demos: [{ Component: BadgeDemo }],
      },
      {
        slug: 'card',
        name: 'Card',
        description: 'Compound surface: header, title, description, content, footer, action.',
        exports: [
          'Card',
          'CardHeader',
          'CardTitle',
          'CardDescription',
          'CardContent',
          'CardFooter',
        ],
        demos: [{ Component: CardDemo }],
      },
      {
        slug: 'avatar',
        name: 'Avatar & Icons',
        description: 'Initial-derived avatars plus the icon button and icon container wrappers.',
        exports: ['Avatar', 'IconButton', 'IconContainer'],
        demos: [{ Component: AvatarDemo }],
      },
      {
        slug: 'loading',
        name: 'Skeleton & Spinner',
        description: 'Placeholder shapes and the indeterminate spinner.',
        exports: ['Skeleton', 'Spinner'],
        demos: [{ Component: LoadingDemo }],
      },
      {
        slug: 'separator',
        name: 'Separator',
        description: 'Horizontal or vertical rule, decorative by default.',
        exports: ['Separator'],
        demos: [{ Component: SeparatorDemo }],
      },
    ],
  },
  {
    slug: 'data-display',
    label: 'Data Display',
    description: 'Tables, stat cards, status indicators, code and progress.',
    components: [
      {
        slug: 'stat-card',
        name: 'StatCard',
        description:
          'Headline figure with icon, trend, progress and a composable description slot.',
        exports: [
          'StatCard',
          'Sparkline',
          'MiniBars',
          'StatBreakdown',
          'StatProgress',
          'StatComparison',
        ],
        demos: [
          { title: 'Basics', Component: StatCardDemo },
          { title: 'Composable extensions', Component: StatCardAdvancedDemo },
        ],
      },
      {
        slug: 'table',
        name: 'Table',
        description: 'Unstyled-by-default table parts, shown with the filter bar above them.',
        exports: [
          'Table',
          'TableHeader',
          'TableBody',
          'TableRow',
          'TableHead',
          'TableCell',
          'FilterBar',
          'FilterSearch',
          'FilterButtonGroup',
          'FilterSort',
          'FilterClear',
          'FilterResults',
        ],
        demos: [
          { title: 'Machines, with a filter bar', Component: TableMachinesDemo },
          { title: 'Runs', Component: TableRunsDemo },
        ],
      },
      {
        slug: 'data-table',
        name: 'DataTable',
        description: 'Column-driven table with sorting, density, row actions and an empty slot.',
        exports: ['DataTable'],
        demos: [{ Component: DataTableDemo }],
      },
      {
        slug: 'entity-list',
        name: 'EntityList',
        description: 'Flat bordered list of rows with stretched links and trailing actions.',
        exports: ['EntityList', 'ListRow'],
        demos: [{ Component: EntityListDemo }],
      },
      {
        slug: 'pagination',
        name: 'Pagination',
        description: 'Page stepper with ellipsis collapsing for long ranges.',
        exports: ['Pagination'],
        demos: [{ Component: PaginationDemo }],
      },
      {
        slug: 'empty-state',
        name: 'EmptyState',
        description: 'Icon, title, description and one call to action for zero-result surfaces.',
        exports: ['EmptyState'],
        demos: [{ Component: EmptyStateDemo }],
      },
      {
        slug: 'status-dot',
        name: 'StatusDot',
        description: 'Eight-state coloured dot with an optional label.',
        exports: ['StatusDot'],
        demos: [{ Component: StatusDotDemo }],
      },
      {
        slug: 'code-block',
        name: 'CodeBlock',
        description: 'Copyable code surface plus the inline code span.',
        exports: ['CodeBlock', 'InlineCode'],
        demos: [{ Component: CodeBlockDemo }],
      },
      {
        slug: 'progress',
        name: 'Progress',
        description: 'Determinate or indeterminate bar in the semantic variants.',
        exports: ['Progress'],
        demos: [{ Component: ProgressDemo }],
      },
      {
        slug: 'usage-meter',
        name: 'UsageMeter',
        description: 'Quota bar that changes tone as it crosses its thresholds.',
        exports: ['UsageMeter', 'QuotaBanner'],
        demos: [{ Component: UsageMeterDemo }],
      },
    ],
  },
  {
    slug: 'cards',
    label: 'Cards',
    description: 'Chart-shaped cards for dashboards: gauges, donuts, funnels, heatmaps.',
    components: [
      {
        slug: 'gauge-card',
        name: 'GaugeCard',
        description: 'Semicircle gauge with optional warning and critical threshold zones.',
        exports: ['GaugeCard'],
        demos: [{ Component: GaugeCardDemo }],
      },
      {
        slug: 'donut-card',
        name: 'DonutCard',
        description: 'Part-of-whole donut with legend and an optional centre label.',
        exports: ['DonutCard'],
        demos: [{ Component: DonutCardDemo }],
      },
      {
        slug: 'score-card',
        name: 'ScoreCard',
        description: 'Score on a banded scale, for NPS, CSAT and health numbers.',
        exports: ['ScoreCard'],
        demos: [{ Component: ScoreCardDemo }],
      },
      {
        slug: 'funnel-card',
        name: 'FunnelCard',
        description: 'Vertical conversion funnel with per-stage drop-off.',
        exports: ['FunnelCard'],
        demos: [{ Component: FunnelCardDemo }],
      },
      {
        slug: 'heatmap-card',
        name: 'HeatmapCard',
        description: 'Grid where cell intensity encodes value: activity, cohorts, error rates.',
        exports: ['HeatmapCard'],
        demos: [{ Component: HeatmapCardDemo }],
      },
      {
        slug: 'multi-stat-card',
        name: 'MultiStatCard',
        description: 'Several related figures under one header instead of a noisy 4-up.',
        exports: ['MultiStatCard'],
        demos: [{ Component: MultiStatCardDemo }],
      },
      {
        slug: 'ranked-list-card',
        name: 'RankedListCard',
        description: 'Top-N list of rank, label, value and a hint.',
        exports: ['RankedListCard'],
        demos: [{ Component: RankedListCardDemo }],
      },
    ],
  },
  {
    slug: 'forms',
    label: 'Forms',
    description: 'Inputs, selection controls and the field wrapper that labels them.',
    components: [
      {
        slug: 'input',
        name: 'Input, Textarea & Select',
        description: 'Text controls wrapped in FormField for label, hint and error.',
        exports: [
          'Input',
          'Textarea',
          'Select',
          'SelectTrigger',
          'SelectContent',
          'SelectItem',
          'FormField',
        ],
        demos: [{ Component: InputDemo }],
      },
      {
        slug: 'label',
        name: 'Label',
        description: 'Form label with a required marker, bound through htmlFor.',
        exports: ['Label'],
        demos: [{ Component: LabelDemo }],
      },
      {
        slug: 'checkbox',
        name: 'Checkbox & Switch',
        description: 'The two boolean controls, controlled through onCheckedChange.',
        exports: ['Checkbox', 'Switch'],
        demos: [{ Component: CheckboxDemo }],
      },
      {
        slug: 'radio-group',
        name: 'RadioGroup',
        description: 'Single-choice group with roving focus.',
        exports: ['RadioGroup', 'RadioGroupItem'],
        demos: [{ Component: RadioGroupDemo }],
      },
      {
        slug: 'slider',
        name: 'Slider',
        description: 'Single-thumb range input with keyboard stepping.',
        exports: ['Slider'],
        demos: [{ Component: SliderDemo }],
      },
      {
        slug: 'combobox',
        name: 'Combobox',
        description: 'Filterable single-select with descriptions per option.',
        exports: ['Combobox'],
        demos: [{ Component: ComboboxDemo }],
      },
      {
        slug: 'date-picker',
        name: 'DatePicker',
        description: 'Popover calendar over a text trigger.',
        exports: ['DatePicker'],
        demos: [{ Component: DatePickerDemo }],
      },
      {
        slug: 'toggle-group',
        name: 'ToggleGroup',
        description: 'Segmented single-choice control laid out on a column grid.',
        exports: ['ToggleGroup'],
        demos: [{ Component: ToggleGroupDemo }],
      },
    ],
  },
  {
    slug: 'feedback',
    label: 'Feedback',
    description: 'Everything that interrupts: alerts, overlays, menus and toasts.',
    components: [
      {
        slug: 'alert',
        name: 'Alert',
        description: 'Inline banner in five tones, optionally dismissible.',
        exports: ['Alert'],
        demos: [{ Component: AlertDemo }],
      },
      {
        slug: 'toast',
        name: 'Toast',
        description: 'Transient notifications queued through the useToast hook.',
        exports: ['ToastProvider', 'useToast'],
        demos: [{ Component: ToastDemo }],
      },
      {
        slug: 'tooltip',
        name: 'Tooltip',
        description: 'Hover and focus hint anchored on any of four sides.',
        exports: ['Tooltip'],
        demos: [{ Component: TooltipDemo }],
      },
      {
        slug: 'modal',
        name: 'Modal',
        description: 'Focus-trapped centred dialog with a footer slot.',
        exports: ['Modal', 'ModalFooter'],
        demos: [{ Component: ModalDemo }],
      },
      {
        slug: 'alert-dialog',
        name: 'AlertDialog',
        description: 'Confirm or cancel dialog for destructive actions.',
        exports: ['AlertDialog'],
        demos: [{ Component: AlertDialogDemo }],
      },
      {
        slug: 'sheet',
        name: 'Sheet',
        description: 'Edge-anchored panel with its own header slot.',
        exports: ['Sheet'],
        demos: [{ Component: SheetDemo }],
      },
      {
        slug: 'dropdown-menu',
        name: 'DropdownMenu',
        description: 'Trigger-anchored menu with labels, separators and destructive items.',
        exports: ['DropdownMenu', 'DropdownMenuItem', 'DropdownMenuLabel', 'DropdownMenuSeparator'],
        demos: [{ Component: DropdownMenuDemo }],
      },
      {
        slug: 'context-menu',
        name: 'ContextMenu',
        description: 'Right-click menu, also reachable with Shift+F10.',
        exports: ['ContextMenu', 'ContextMenuItem', 'ContextMenuLabel', 'ContextMenuSeparator'],
        demos: [{ Component: ContextMenuDemo }],
      },
      {
        slug: 'popover',
        name: 'Popover',
        description: 'Controlled floating panel anchored to its trigger.',
        exports: ['Popover'],
        demos: [{ Component: PopoverDemo }],
      },
      {
        slug: 'hover-card',
        name: 'HoverCard',
        description: 'Rich preview card shown on hover or focus.',
        exports: ['HoverCard'],
        demos: [{ Component: HoverCardDemo }],
      },
      {
        slug: 'command',
        name: 'Command',
        description: 'Command palette with built-in filtering; the search on this site uses it.',
        exports: ['Command', 'CommandGroup', 'CommandItem', 'CommandSeparator', 'CommandEmpty'],
        demos: [{ Component: CommandDemo }],
      },
      {
        slug: 'overlay-portals',
        name: 'Overlay portals',
        description:
          'Every overlay renders into document.body, so clipping ancestors cannot cut it.',
        exports: ['Tooltip', 'DropdownMenu', 'Popover', 'HoverCard', 'Modal'],
        demos: [{ Component: OverlayPortalsDemo }],
      },
      {
        slug: 'danger-zone',
        name: 'DangerZone',
        description: 'Destructive-action block, paired with type-the-phrase confirmation.',
        exports: ['DangerZone', 'DangerZoneAction', 'ConfirmByTyping'],
        demos: [{ Component: DangerZoneDemo }],
      },
    ],
  },
  {
    slug: 'layout',
    label: 'Layout',
    description: 'Page scaffolding: headers, sections, sidebars and split panes.',
    components: [
      {
        slug: 'page-header',
        name: 'PageHeader',
        description: 'Icon, title, subtitle and an action row for a page or detail view.',
        exports: ['PageHeader'],
        demos: [{ Component: PageHeaderDemo }],
      },
      {
        slug: 'section',
        name: 'Section',
        description: 'Titled settings block with an icon and a trailing action.',
        exports: ['Section'],
        demos: [{ Component: SectionDemo }],
      },
      {
        slug: 'sidebar',
        name: 'Sidebar',
        description: 'App shell navigation with grouped links, header and footer.',
        exports: [
          'Sidebar',
          'SidebarHeader',
          'SidebarContent',
          'SidebarGroup',
          'SidebarGroupLabel',
          'SidebarFooter',
          'NavLink',
        ],
        demos: [{ Component: SidebarDemo }],
      },
      {
        slug: 'resizable',
        name: 'Resizable panels',
        description: 'Draggable and keyboard-resizable split panes that persist their sizes.',
        exports: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'],
        demos: [{ Component: ResizableDemo }],
      },
      {
        slug: 'scroll-area',
        name: 'ScrollArea',
        description: 'Scroll container with a styled, focusable viewport.',
        exports: ['ScrollArea'],
        demos: [{ Component: ScrollAreaDemo }],
      },
    ],
  },
  {
    slug: 'navigation',
    label: 'Navigation',
    description: 'Wayfinding and typography: breadcrumbs, tabs, headings, prose.',
    components: [
      {
        slug: 'breadcrumb',
        name: 'Breadcrumb',
        description: 'Ancestor trail ending in the current page.',
        exports: [
          'Breadcrumb',
          'BreadcrumbList',
          'BreadcrumbItem',
          'BreadcrumbLink',
          'BreadcrumbPage',
          'BreadcrumbSeparator',
        ],
        demos: [{ Component: BreadcrumbDemo }],
      },
      {
        slug: 'tabs',
        name: 'Tabs',
        description: 'Arrow-key tab list in a boxed or underline variant.',
        exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
        demos: [
          { title: 'Default', Component: TabsDemo },
          { title: 'Underline', Component: TabsUnderlineDemo },
        ],
      },
      {
        slug: 'heading',
        name: 'Heading',
        description: 'h1 to h4 with an optional supporting description.',
        exports: ['Heading'],
        demos: [{ Component: HeadingDemo }],
      },
      {
        slug: 'prose',
        name: 'Prose',
        description: 'Typographic wrapper for arbitrary rich text.',
        exports: ['Prose'],
        demos: [{ Component: ProseDemo }],
      },
      {
        slug: 'kbd',
        name: 'Kbd',
        description: 'Keyboard key rendered as a physical cap.',
        exports: ['Kbd'],
        demos: [{ Component: KbdDemo }],
      },
      {
        slug: 'collapsible',
        name: 'Collapsible',
        description: 'Single disclosure with a controlled open state.',
        exports: ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent'],
        demos: [{ Component: CollapsibleDemo }],
      },
      {
        slug: 'accordion',
        name: 'Accordion',
        description: 'Grouped disclosures for FAQ-style content.',
        exports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
        demos: [{ Component: AccordionDemo }],
      },
    ],
  },
  {
    slug: 'site-docs',
    label: 'Site & Docs',
    description: 'Marketing and documentation chrome shared with the public sites.',
    components: [
      {
        slug: 'markdown',
        name: 'MarkdownRenderer',
        description: 'GitHub-flavoured markdown with optional raw HTML.',
        exports: ['MarkdownRenderer'],
        demos: [{ Component: MarkdownDemo }],
      },
      {
        slug: 'copy-button',
        name: 'CopyButton',
        description: 'Copy-to-clipboard button with a confirmed state and no layout shift.',
        exports: ['CopyButton'],
        demos: [{ Component: CopyButtonDemo }],
      },
      {
        slug: 'chip',
        name: 'Chip',
        description: 'Small tag, optionally removable or clickable.',
        exports: ['Chip'],
        demos: [{ Component: ChipDemo }],
      },
      {
        slug: 'footer',
        name: 'Footer',
        description: 'Site footer with link columns and a bottom bar.',
        exports: ['Footer', 'FooterSections', 'FooterSection', 'FooterLink', 'FooterBottom'],
        demos: [{ Component: FooterDemo }],
      },
      {
        slug: 'top-bar',
        name: 'TopBar',
        description: 'Marketing top bar: brand, nav and actions.',
        exports: ['TopBar', 'TopBarBrand', 'TopBarNav', 'TopBarNavItem', 'TopBarActions'],
        demos: [{ Component: TopBarDemo }],
      },
      {
        slug: 'doc-sidebar',
        name: 'DocSidebar',
        description: 'Documentation navigation with grouped, nestable items.',
        exports: ['DocSidebar', 'DocSidebarGroup', 'DocSidebarItem'],
        demos: [{ Component: DocSidebarDemo }],
      },
    ],
  },
];

export interface ResolvedComponent {
  category: CategoryEntry;
  component: ComponentEntry;
}

export const ALL_COMPONENTS: ResolvedComponent[] = CATEGORIES.flatMap((category) =>
  category.components.map((component) => ({ category, component }))
);

export const componentPath = (categorySlug: string, componentSlug: string): string =>
  `/components/${categorySlug}/${componentSlug}`;

export const findComponent = (
  categorySlug: string,
  componentSlug: string
): ResolvedComponent | undefined =>
  ALL_COMPONENTS.find(
    ({ category, component }) => category.slug === categorySlug && component.slug === componentSlug
  );
