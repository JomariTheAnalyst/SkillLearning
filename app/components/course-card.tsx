import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description?: string | null;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: 'SQL' | 'PYTHON' | 'EXCEL';
};

type CourseCardProps = {
  course: Course;
  modulesCount?: number;
  lessonsCount?: number;
};

export function CourseCard({ course, modulesCount = 0, lessonsCount = 0 }: CourseCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background">
      <div className="aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="p-4 absolute bottom-0 left-0 right-0">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium">
            {course.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{course.title}</h3>
        <p className="text-muted-foreground mt-2 line-clamp-2">
          {course.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {modulesCount} modules • {lessonsCount} lessons
          </span>
          <Link 
            href={`/courses/${course.category.toLowerCase()}/${course.id}`}
            className="inline-flex items-center text-sm font-medium text-primary"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
} 