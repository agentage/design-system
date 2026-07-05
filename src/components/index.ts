export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './accordion';

export { Alert, alertVariants } from './alert';
export type { AlertProps } from './alert';

export { AlertDialog } from './alert-dialog';
export type { AlertDialogProps } from './alert-dialog';

export { Avatar } from './avatar';
export type { AvatarProps, AvatarSize } from './avatar';

export { Badge, badgeVariants } from './badge';
export type { BadgeProps } from './badge';

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

export { Checkbox } from './checkbox';
export type { CheckboxProps } from './checkbox';

export { CodeBlock, InlineCode } from './code-block';
export type { CodeBlockProps, InlineCodeProps } from './code-block';

export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from './collapsible';

export { Combobox } from './combobox';
export type { ComboboxOption, ComboboxProps } from './combobox';

export { Command, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from './command';
export type { CommandProps, CommandGroupProps, CommandItemProps } from './command';

export { DatePicker } from './date-picker';
export type { DatePickerProps } from './date-picker';

export {
  FilterBar,
  FilterButtonGroup,
  FilterClear,
  FilterResults,
  FilterSearch,
  FilterSort,
} from './filter-bar';
export type {
  FilterBarProps,
  FilterButtonGroupProps,
  FilterClearProps,
  FilterOption,
  FilterResultsProps,
  FilterSearchProps,
  FilterSortProps,
  SortOption,
} from './filter-bar';

export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './dropdown-menu';
export type {
  DropdownMenuProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
} from './dropdown-menu';

export { EmptyState } from './empty-state';
export type { EmptyStateProps } from './empty-state';

export { FormField } from './form-field';
export type { FormFieldProps } from './form-field';

export { Heading } from './heading';
export type { HeadingProps } from './heading';

export { HoverCard } from './hover-card';
export type { HoverCardProps } from './hover-card';

export { IconButton } from './icon-button';
export type { IconButtonProps } from './icon-button';

export { IconContainer } from './icon-container';
export type { IconContainerColor, IconContainerProps, IconContainerSize } from './icon-container';

export { Input, Textarea } from './input';
export type { InputProps, TextareaProps } from './input';

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';
export type { SelectTriggerProps } from './select';

export { Kbd } from './kbd';
export type { KbdProps } from './kbd';

export { Label } from './label';
export type { LabelProps } from './label';

export { Modal, ModalFooter } from './modal';
export type { ModalFooterProps, ModalProps } from './modal';

export { NavLink } from './nav-link';
export type { NavLinkProps } from './nav-link';

export { PageHeader } from './page-header';
export type { PageHeaderAction, PageHeaderProps } from './page-header';

export { PageLayout } from './page-layout';
export type { PageLayoutProps } from './page-layout';

export { Pagination } from './pagination';
export type { PaginationProps } from './pagination';

export { Popover } from './popover';
export type { PopoverProps } from './popover';

export { Progress } from './progress';
export type { ProgressProps } from './progress';

export { Prose } from './prose';
export type { ProseProps } from './prose';

export { RadioGroup, RadioGroupItem } from './radio-group';
export type { RadioGroupProps, RadioGroupItemProps } from './radio-group';

export { ScrollArea } from './scroll-area';
export type { ScrollAreaProps } from './scroll-area';

export { Section } from './section';
export type { SectionProps } from './section';

export { Separator } from './separator';
export type { SeparatorProps } from './separator';

export { Sheet } from './sheet';
export type { SheetProps } from './sheet';

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from './sidebar';
export type { SidebarProps } from './sidebar';

export { Skeleton } from './skeleton';
export type { SkeletonProps } from './skeleton';

export { Slider } from './slider';
export type { SliderProps } from './slider';

export { Spinner } from './spinner';
export type { SpinnerProps } from './spinner';

export { StatCard } from './stat-card';
export type { StatCardProps, StatCardTrend } from './stat-card';

export { StatusDot, statusDotVariants } from './status-dot';
export type { StatusDotProps } from './status-dot';

export { Switch } from './switch';
export type { SwitchProps } from './switch';

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from './tabs';

export { ToastProvider, useToast } from './toast';

export { ToggleButton, ToggleGroup } from './toggle-group';
export type { ToggleButtonProps, ToggleGroupProps, ToggleOption } from './toggle-group';

export { Tooltip } from './tooltip';
export type { TooltipProps } from './tooltip';

// ─── Catalog & Site additions (mcpxhub merge gap-fill) ────────────────────────

export { Chip, chipVariants } from './chip';
export type { ChipProps } from './chip';

export { CopyButton } from './copy-button';
export type { CopyButtonProps } from './copy-button';

export { DocSidebar, DocSidebarGroup, DocSidebarItem } from './doc-sidebar';
export type { DocSidebarProps, DocSidebarGroupProps, DocSidebarItemProps } from './doc-sidebar';

export { Footer, FooterSections, FooterSection, FooterLink, FooterBottom } from './footer';
export type { FooterProps, FooterSectionProps, FooterBottomProps } from './footer';

export { MarkdownRenderer } from './markdown';
export type { MarkdownRendererProps } from './markdown';

export { TopBar, TopBarBrand, TopBarNav, TopBarNavItem, TopBarActions } from './top-bar';
export type { TopBarProps, TopBarNavItemProps } from './top-bar';

// ─── Stat Card advanced composables ──────────────────────────────────────────

export {
  Sparkline,
  MiniBars,
  StatBreakdown,
  StatProgress,
  StatComparison,
} from './stat-card-extensions';
export type {
  SparklineProps,
  MiniBarsProps,
  BreakdownSegment,
  StatBreakdownProps,
  StatProgressProps,
  StatComparisonProps,
} from './stat-card-extensions';

// ─── Advanced full-card patterns (gauge, donut, score, funnel, …) ────────────

export {
  GaugeCard,
  DonutCard,
  ScoreCard,
  FunnelCard,
  HeatmapCard,
  MultiStatCard,
  RankedListCard,
} from './card-patterns';
export type {
  GaugeCardProps,
  DonutSegment,
  DonutCardProps,
  ScoreBand,
  ScoreCardProps,
  FunnelStage,
  FunnelCardProps,
  HeatmapCardProps,
  MultiStat,
  MultiStatCardProps,
  RankedItem,
  RankedListCardProps,
} from './card-patterns';
