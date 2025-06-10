"use client";

import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { useIsMobile } from "@/shared/ui/use-mobile";
import { cn } from "@/shared/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  side: "left" | "right";
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      side: "left",
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="sidebar-trigger"
      size="icon"
      variant="ghost"
      aria-label="Toggle sidebar"
      className={cn(
        "z-10 group-data-[side=left]:-ml-[calc(var(--sidebar-width-icon)/2)] group-data-[side=right]:-mr-[calc(var(--sidebar-width-icon)/2)] size-10 rounded-full transition-all duration-200 ease-linear group-data-[collapsible=offcanvas]:ml-0 group-data-[collapsible=offcanvas]:opacity-0 group-data-[collapsible=offcanvas]:group-hover/sidebar-wrapper:ml-[-1.5rem] group-data-[collapsible=offcanvas]:group-hover/sidebar-wrapper:opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-100 group-data-[collapsible=icon]:group-hover/sidebar-wrapper:opacity-100",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        // This check is to prevent the sidebar from closing when the user clicks the trigger on mobile.
        // We want the sidebar to always be open on mobile, but it collapses on desktop.
        if (!useIsMobile()) {
          useSidebar().toggleSidebar();
        }
      }}
      {...props}
    >
      <PanelLeftIcon />
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-slot="sidebar-rail"
      className={cn(
        "bg-sidebar-background group-data-[side=left]:border-r group-data-[side=right]:border-l size-full group-data-[collapsible=icon]:w-(--sidebar-width-icon) transition-all duration-200 ease-linear group-data-[collapsible=offcanvas]:hidden",
        className,
      )}
      onClick={toggleSidebar}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  const { isMobile } = useSidebar();
  const isExpanded = useSidebar().state === "expanded";

  // This is a hack to make the sidebar inset work well with the fixed sidebar.
  // This is for use when `variant="inset"` or `variant="floating"`.
  // The `margin-left` or `margin-right` should be the width of the sidebar.
  const getMargin = React.useCallback(() => {
    if (isMobile) {
      return 0;
    }

    if (isExpanded) {
      return `var(--sidebar-width)`;
    }

    return `calc(var(--sidebar-width-icon) + var(--spacing(4)))`;
  }, [isMobile, isExpanded]);

  return (
    <main
      data-slot="sidebar-inset"
      style={
        {
          marginLeft: useSidebar().side === "left" ? getMargin() : "",
          marginRight: useSidebar().side === "right" ? getMargin() : "",
          transitionProperty: "margin",
          transitionDuration: "200ms",
          transitionTimingFunction: "linear",
        } as React.CSSProperties
      }
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      type="text"
      className={cn("px-4", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "bg-sidebar-header flex h-[3.5rem] items-center p-4",
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "mt-auto flex h-[3.5rem] items-center p-4",
        className,
      )}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      className={cn("my-4", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-auto p-4", className)}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      className={cn(
        "text-muted-foreground py-2 text-sm font-semibold first:pt-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      className={cn(
        "ml-auto size-7 rounded-md text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("grid gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("grid gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn(
        "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground flex items-center justify-between rounded-md text-sm font-medium leading-none transition-colors duration-150 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "group/menu-button flex h-9 w-full items-center justify-start gap-2 rounded-md px-2 text-sm transition-colors duration-150 data-[active=true]:font-medium [&_svg]:size-4 [&_svg]:shrink-0 data-[active=true]:opacity-100 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[active=true]:bg-sidebar-highlighted data-[active=true]:text-sidebar-highlighted-foreground text-sidebar-foreground hover:bg-sidebar-highlighted/50",
        ghost:
          "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
      },
      size: {
        default: "h-9",
        sm: "h-8 px-1",
        lg: "h-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";
  const isExpanded = useSidebar().state === "expanded";

  const textElement = (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      data-expanded={isExpanded}
      className={cn(
        sidebarMenuButtonVariants({ variant, size, className }),
        "group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:data-[expanded=true]:w-full group-data-[collapsible=icon]:data-[expanded=true]:px-2",
      )}
      {...props}
    />
  );

  if (tooltip && !isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{textElement}</TooltipTrigger>
        {typeof tooltip === "string" ? (
          <TooltipContent side="right" sideOffset={10}>
            {tooltip}
          </TooltipContent>
        ) : (
          <TooltipContent side="right" sideOffset={10} {...tooltip} />
        )}
      </Tooltip>
    );
  }

  return textElement;
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-show-on-hover={showOnHover}
      className={cn(
        "opacity-0 transition-opacity group-hover/menu-button:opacity-100 group-data-[collapsible=icon]:group-data-[expanded=true]/menu-button:opacity-100 group-data-[show-on-hover=true]:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const isExpanded = useSidebar().state === "expanded";

  return (
    <div
      data-slot="sidebar-menu-badge"
      data-expanded={isExpanded}
      className={cn(
        "bg-primary text-primary-foreground ml-auto whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium opacity-0 transition-all duration-150 group-hover/menu-button:opacity-100 group-data-[collapsible=icon]:group-data-[expanded=true]/menu-button:opacity-100 group-data-[collapsible=icon]:group-data-[expanded=true]/menu-button:group-hover/menu-button:opacity-100",
        "group-data-[collapsible=icon]:group-data-[state=collapsed]/menu-button:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  const isExpanded = useSidebar().state === "expanded";

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={cn(
        "flex w-full items-center gap-2 px-2",
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton className="size-4 shrink-0 rounded-sm" />
      )}
      <div
        data-slot="sidebar-menu-skeleton-text"
        data-expanded={isExpanded}
        className={cn(
          "flex-1",
          "group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:data-[expanded=true]:w-full",
        )}
      >
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-4 w-4 shrink-0 rounded-full opacity-0 group-data-[collapsible=icon]:data-[expanded=true]:opacity-100" />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn("grid gap-1 px-4", className)}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      className={cn("flex items-center justify-between rounded-md text-sm", className)}
      {...props}
    />
  );
}

const sidebarMenuSubButtonVariants = cva(
  "group/menu-button flex h-9 w-full items-center justify-start gap-2 rounded-md px-2 text-sm transition-colors duration-150 data-[active=true]:font-medium [&_svg]:size-4 [&_svg]:shrink-0 data-[active=true]:opacity-100 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-1",
        md: "h-9 px-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "a";
  const isExpanded = useSidebar().state === "expanded";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-active={isActive}
      data-expanded={isExpanded}
      className={cn(
        sidebarMenuSubButtonVariants({ size, className }),
        "group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:data-[expanded=true]:w-full group-data-[collapsible=icon]:data-[expanded=true]:px-2",
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInput,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
}; 