'use client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
} from '../../src';

export const Demo = () => (
  <>
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Description text.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Compound: Header, Title, Description, Content, Action.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Loading State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="rectangular" className="h-16" />
          </div>
        </CardContent>
      </Card>
      <Card variant="flat">
        <p className="text-sm font-semibold">Flat variant</p>
        <p className="mt-1 text-sm text-muted-foreground">
          p-5, no shadow, block layout — for content that brings its own spacing.
        </p>
      </Card>
    </div>
  </>
);
