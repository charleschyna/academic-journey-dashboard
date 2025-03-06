
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  className?: string;
}

const DataCard = ({ title, value, icon, change, className }: DataCardProps) => {
  return (
    <div className={cn(
      "relative overflow-hidden glass-card p-6 transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {typeof change !== 'undefined' && (
            <p className={cn(
              "text-xs font-medium mt-2",
              change >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
              <span className="text-muted-foreground ml-1">from last term</span>
            </p>
          )}
        </div>
        
        {icon && (
          <div className="rounded-full p-2 bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/10">
        <div 
          className={cn(
            "h-full transition-all duration-500",
            change && change >= 0 ? "bg-green-500" : "bg-primary"
          )} 
          style={{ width: `${Math.min(Math.abs(change || 50), 100)}%` }}
        />
      </div>
    </div>
  );
};

export default DataCard;
