
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

const PageHeader = ({ 
  title, 
  description, 
  action,
  className 
}: PageHeaderProps) => {
  return (
    <div className={cn("pb-6 space-y-2", className)}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight animate-slide-down">
          {title}
        </h1>
        
        {action && (
          <Button 
            onClick={action.onClick}
            className="animate-fade-in"
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>
      
      {description && (
        <p className="text-muted-foreground animate-slide-down" style={{ animationDelay: '50ms' }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
