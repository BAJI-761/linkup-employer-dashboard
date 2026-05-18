import { Briefcase, FileText, Users, Zap } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatCard from '../components/cards/StatCard';
import BarChartWidget from '../components/charts/BarChartWidget';
import PieChartWidget from '../components/charts/PieChartWidget';
import RecentActivity from '../components/widgets/RecentActivity';
import QuickActions from '../components/widgets/QuickActions';
import dashboardHero from '../assets/images/dashboard_hero.png';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { computed } = useDashboard();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className={styles.page}>
      {/* Masthead */}
      <header className={styles.masthead}>
        <div className={styles.mastheadContent}>
          <span className={styles.dateline}>{today}</span>
          <h1 className={styles.headline}>THE COMMAND DESK</h1>
          <p className={styles.tagline}>Employer Intelligence & Hiring Analytics</p>
        </div>
        <div className={styles.heroImage}>
          <img src={dashboardHero} alt="Command Desk" />
          <div className={styles.heroOverlay} />
        </div>
      </header>

      {/* Stats Grid */}
      <section className={styles.statsGrid}>
        <StatCard icon={Briefcase} label="Total Jobs Posted" value={computed.totalJobs} trend="+8.2%" trendDirection="up" delay={0} />
        <StatCard icon={FileText} label="Total Applications" value={computed.totalApplications} trend="+12.5%" trendDirection="up" delay={1} />
        <StatCard icon={Users} label="Total Users" value={computed.totalUsers} trend="+3.1%" trendDirection="up" delay={2} />
        <StatCard icon={Zap} label="Active Jobs" value={computed.activeJobs} trend="-2.4%" trendDirection="down" delay={3} />
      </section>

      {/* Charts Row */}
      <section className={styles.chartsRow}>
        <div className={styles.chartMain}>
          <BarChartWidget />
        </div>
        <div className={styles.chartSide}>
          <PieChartWidget />
        </div>
      </section>

      {/* Bottom Row */}
      <section className={styles.bottomRow}>
        <div className={styles.activityCol}>
          <RecentActivity />
        </div>
        <div className={styles.actionsCol}>
          <QuickActions />
        </div>
      </section>
    </div>
  );
}
