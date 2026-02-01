'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  IconButton,
  Card,
  AnimatedCard,
  StatusCard,
  Skeleton,
  CardSkeleton,
  StatCardSkeleton,
  TableSkeleton,
  ListSkeleton,
  TechStatusSkeleton,
  DashboardSkeleton,
  CalendarSkeleton,
  RouteListSkeleton,
  InvoiceListSkeleton,
  Spinner,
  LoadingOverlay,
  InlineLoader,
  EmptyState,
  CustomersEmptyState,
  InvoicesEmptyState,
  AlertsEmptyState,
  ErrorFallback,
  AnimatedList,
  FadeIn,
  SlideIn,
  ScaleIn,
  ToastProvider,
  useToastContext,
} from '@/components/ui';

// Toast demo component
function ToastDemo() {
  const toast = useToastContext();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="success"
        size="sm"
        onClick={() => toast.success('Customer created successfully!')}
      >
        Success Toast
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => toast.error('Failed to save, please retry')}
      >
        Error Toast
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.info('Your changes have been saved')}
      >
        Info Toast
      </Button>
    </div>
  );
}

export default function DemoPage() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [listItems, setListItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  const handleAddItem = () => {
    setListItems([...listItems, `Item ${listItems.length + 1}`]);
  };

  const handleRemoveItem = () => {
    setListItems(listItems.slice(0, -1));
  };

  return (
    <ToastProvider>
      <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">UI Components Demo</h1>
          <p className="text-slate-500 mt-2">
            Loading states, skeletons, animations, empty states, and more
          </p>
        </div>

        {/* Buttons with Loading States */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            1. Buttons with Loading States
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button loading={buttonLoading} onClick={handleButtonClick}>
              Click to Load
            </Button>
            <Button loading={buttonLoading} loadingText="Saving..." onClick={handleButtonClick}>
              With Loading Text
            </Button>
            <Button variant="secondary" loading={buttonLoading} onClick={handleButtonClick}>
              Secondary
            </Button>
            <Button variant="danger" loading={buttonLoading} onClick={handleButtonClick}>
              Danger
            </Button>
            <Button variant="success" loading={buttonLoading} onClick={handleButtonClick}>
              Success
            </Button>
            <Button variant="outline" loading={buttonLoading} onClick={handleButtonClick}>
              Outline
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <IconButton
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
              label="Add item"
            />
            <IconButton
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              }
              label="Edit"
              variant="outline"
            />
            <IconButton
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
              label="Delete"
              variant="danger"
              loading={buttonLoading}
            />
          </div>
        </section>

        {/* Toast Notifications */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            2. Toast Notifications
          </h2>
          <ToastDemo />
        </section>

        {/* Cards with Effects */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            3. Cards with Hover Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover title="Hover Card">
              <p className="text-slate-600">Hover over me to see the effect</p>
            </Card>
            <Card interactive title="Interactive Card">
              <p className="text-slate-600">Click me for interaction feedback</p>
            </Card>
            <Card
              loading={cardLoading}
              title="Loading Card"
              action={
                <Button size="xs" variant="outline" onClick={() => setCardLoading(!cardLoading)}>
                  Toggle
                </Button>
              }
            >
              <p className="text-slate-600">Toggle the loading state</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <StatusCard status="success" title="Success">
              <p className="text-slate-600">Operation completed</p>
            </StatusCard>
            <StatusCard status="warning" title="Warning">
              <p className="text-slate-600">Please review</p>
            </StatusCard>
            <StatusCard status="error" title="Error">
              <p className="text-slate-600">Something went wrong</p>
            </StatusCard>
          </div>
        </section>

        {/* Skeleton Loading States */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            4. Skeleton Loading States
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Basic Skeletons</h3>
              <div className="space-y-2 max-w-md">
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={16} />
                <Skeleton variant="text" height={16} width="80%" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Stat Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Card Skeleton</h3>
              <div className="max-w-md">
                <CardSkeleton showAvatar lines={3} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Tech Status Card</h3>
              <div className="max-w-md">
                <TechStatusSkeleton />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">List Skeleton</h3>
              <div className="max-w-md">
                <ListSkeleton items={3} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Route Stops</h3>
              <div className="max-w-md">
                <RouteListSkeleton stops={3} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Invoice List</h3>
              <div className="max-w-md">
                <InvoiceListSkeleton items={3} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Table Skeleton</h3>
              <TableSkeleton rows={3} columns={4} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Calendar Skeleton</h3>
              <div className="max-w-md">
                <CalendarSkeleton />
              </div>
            </div>
          </div>
        </section>

        {/* Spinners */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            5. Spinners & Loaders
          </h2>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <Spinner size="xs" />
              <p className="text-xs text-slate-500 mt-2">XS</p>
            </div>
            <div className="text-center">
              <Spinner size="sm" />
              <p className="text-xs text-slate-500 mt-2">SM</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="text-xs text-slate-500 mt-2">MD</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-xs text-slate-500 mt-2">LG</p>
            </div>
            <div className="text-center">
              <Spinner size="xl" />
              <p className="text-xs text-slate-500 mt-2">XL</p>
            </div>
          </div>

          <div className="mt-6">
            <InlineLoader text="Loading data..." />
          </div>
        </section>

        {/* Empty States */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            6. Empty States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomersEmptyState onAdd={() => alert('Add customer clicked')} />
            <InvoicesEmptyState onAdd={() => alert('Create invoice clicked')} />
            <AlertsEmptyState />
            <EmptyState
              icon={
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
              title="No results found"
              description="We couldn't find anything matching your search. Try different keywords."
              variant="card"
            />
          </div>
        </section>

        {/* Error States */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            7. Error States
          </h2>
          <div className="max-w-md">
            <ErrorFallback
              error={new Error('Something unexpected happened')}
              onRetry={() => alert('Retry clicked')}
              variant="card"
            />
          </div>
        </section>

        {/* Animations */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            8. Animations
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Animated List</h3>
              <div className="flex gap-2 mb-4">
                <Button size="sm" onClick={handleAddItem}>Add Item</Button>
                <Button size="sm" variant="outline" onClick={handleRemoveItem}>Remove Item</Button>
              </div>
              <div className="max-w-md space-y-2">
                <AnimatePresence mode="popLayout">
                  {listItems.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-white border border-slate-200 rounded-lg"
                    >
                      {item}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Animated Cards (staggered)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <AnimatedCard key={i} index={i}>
                    <p className="text-slate-600">Animated card {i + 1}</p>
                  </AnimatedCard>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Slide Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SlideIn direction="up" delay={0}>
                  <Card padding="sm">
                    <p className="text-sm text-slate-600">Slide Up</p>
                  </Card>
                </SlideIn>
                <SlideIn direction="down" delay={0.1}>
                  <Card padding="sm">
                    <p className="text-sm text-slate-600">Slide Down</p>
                  </Card>
                </SlideIn>
                <SlideIn direction="left" delay={0.2}>
                  <Card padding="sm">
                    <p className="text-sm text-slate-600">Slide Left</p>
                  </Card>
                </SlideIn>
                <SlideIn direction="right" delay={0.3}>
                  <Card padding="sm">
                    <p className="text-sm text-slate-600">Slide Right</p>
                  </Card>
                </SlideIn>
              </div>
            </div>
          </div>
        </section>

        {/* Full Dashboard Skeleton */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            9. Full Dashboard Skeleton
          </h2>
          <DashboardSkeleton />
        </section>
      </div>
    </ToastProvider>
  );
}
