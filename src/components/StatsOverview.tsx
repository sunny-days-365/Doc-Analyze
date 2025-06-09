
import { FileText, Brain, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsOverviewProps {
  documentsCount: number;
}

const StatsOverview = ({ documentsCount }: StatsOverviewProps) => {
  const stats = [
    {
      title: "Total Documents",
      value: documentsCount.toString(),
      subtitle: "Processed",
      icon: FileText,
      color: "text-ai-primary",
      bgColor: "bg-ai-primary/20"
    },
    {
      title: "AI Analyses",
      value: (documentsCount * 3).toString(),
      subtitle: "Insights Generated",
      icon: Brain,
      color: "text-ai-secondary",
      bgColor: "bg-ai-secondary/20"
    },
    {
      title: "Accuracy Rate",
      value: "95%",
      subtitle: "Average Confidence",
      icon: TrendingUp,
      color: "text-ai-success",
      bgColor: "bg-ai-success/20"
    },
    {
      title: "Processing Time",
      value: "2.3s",
      subtitle: "Average Speed",
      icon: Clock,
      color: "text-ai-accent",
      bgColor: "bg-ai-accent/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 bg-black/20 border-white/10 hover:border-ai-primary/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.subtitle}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor} group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
