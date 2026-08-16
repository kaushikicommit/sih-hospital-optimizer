import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Clock3,
  HeartPulse,
  Sparkles,
  UsersRound,
  Siren,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Beds",
    value: "450",
    change: "+12",
    description: "from yesterday",
    type: "positive",
    color: "blue",
    icon: BedDouble,
  },
  {
    title: "Available Beds",
    value: "108",
    change: "-8",
    description: "from yesterday",
    type: "negative",
    color: "green",
    icon: HeartPulse,
  },
  {
    title: "Today's Appointments",
    value: "128",
    change: "+14%",
    description: "vs last week",
    type: "positive",
    color: "purple",
    icon: CalendarDays,
  },
  {
    title: "Staff On Duty",
    value: "152",
    change: "+6",
    description: "currently active",
    type: "positive",
    color: "cyan",
    icon: UsersRound,
  },
];

function StatCard({
  title,
  value,
  change,
  description,
  type,
  color,
  icon: Icon,
}) {
  const ChangeIcon =
    type === "negative"
      ? ArrowDownRight
      : ArrowUpRight;

  return (
    <article className={`stat-card ${color}`}>

      <div className="stat-card-head">

        <div className="stat-title-wrap">
          <h3>{title}</h3>
        </div>

        <div className="stat-icon">
          <Icon
            size={28}
            strokeWidth={2.1}
          />
        </div>

      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className={`stat-change ${type}`}>

        <ChangeIcon
          size={25}
          strokeWidth={2.3}
        />

        <strong>
          {change}
        </strong>

        <span>
          {description}
        </span>

      </div>

    </article>
  );
}


function Dashboard() {
  return (
    <div className="dashboard">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="hero-card">

        <div className="hero-content">

          <div className="hero-badges">

            <span className="hero-badge">

              <span className="hero-live-dot"></span>

              LIVE MONITORING

            </span>

            <span className="hero-badge">

              <Activity size={15} />

              System operational

            </span>

          </div>

          <h1>
            Welcome back, Admin <span>👋</span>
          </h1>

          <p>
            Here's what's happening across the hospital today.
            Monitor resources, detect demand spikes and let AI
            recommend the next best allocation.
          </p>

          <div className="dashboard-updated">

            <div className="updated-icon">
              <Clock3 size={22} />
            </div>

            <div>

              <span>
                DASHBOARD UPDATED
              </span>

              <strong>
                Just now
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="stats-grid">

        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}

      </section>


      {/* =====================================================
          AI RESOURCE INTELLIGENCE
      ====================================================== */}

      <section className="analytics-grid">

        {/* ===================================================
            AI RESOURCE ALLOCATION
        ==================================================== */}

        <article className="forecast-card resource-intelligence-card">

          {/* HEADER */}

          <div className="section-header">

            <div>

              <div className="section-title-row">

                <h2>
                  AI Resource Allocation
                </h2>

                <span className="ai-pill">

                  <Sparkles size={13} />

                  AI POWERED

                </span>

              </div>

              <p>
                Intelligent overview of current hospital resource pressure
              </p>

            </div>

            <div className="resource-ai-status">

              <span className="resource-status-dot"></span>

              AI ACTIVE

            </div>

          </div>


          {/* MAIN RESOURCE AREA */}

          <div className="resource-intelligence-body">

            {/* LEFT VISUAL */}

            <div className="hospital-resource-visual">

              <div className="hospital-orbit orbit-one"></div>
              <div className="hospital-orbit orbit-two"></div>

              <div className="hospital-core">

                <div className="hospital-core-icon">
                  <Activity
                    size={30}
                    strokeWidth={2}
                  />
                </div>

                <strong>
                  76%
                </strong>

                <span>
                  Overall
                </span>

              </div>

              <div className="resource-node node-emergency">

                <div className="resource-node-icon emergency">
                  <Siren size={16} />
                </div>

                <span>
                  Emergency
                </span>

                <strong>
                  High
                </strong>

              </div>

              <div className="resource-node node-icu">

                <div className="resource-node-icon icu">
                  <HeartPulse size={16} />
                </div>

                <span>
                  ICU
                </span>

                <strong>
                  Rising
                </strong>

              </div>

              <div className="resource-node node-beds">

                <div className="resource-node-icon beds">
                  <BedDouble size={16} />
                </div>

                <span>
                  Beds
                </span>

                <strong>
                  Stable
                </strong>

              </div>

            </div>


            {/* RIGHT STATUS */}

            <div className="resource-status-panel">

              <div className="resource-status-heading">

                <div>

                  <span>
                    RESOURCE STATUS
                  </span>

                  <strong>
                    Current capacity
                  </strong>

                </div>

                <ShieldCheck
                  size={22}
                  className="capacity-check"
                />

              </div>


              {/* EMERGENCY */}

              <div className="resource-progress-item">

                <div className="resource-progress-header">

                  <div className="resource-progress-name">

                    <Siren size={15} />

                    <span>
                      Emergency
                    </span>

                  </div>

                  <strong>
                    68%
                  </strong>

                </div>

                <div className="resource-progress-track">

                  <div
                    className="resource-progress-fill emergency-fill"
                    style={{ width: "68%" }}
                  />

                </div>

                <small>
                  High demand expected
                </small>

              </div>


              {/* ICU */}

              <div className="resource-progress-item">

                <div className="resource-progress-header">

                  <div className="resource-progress-name">

                    <HeartPulse size={15} />

                    <span>
                      ICU Capacity
                    </span>

                  </div>

                  <strong>
                    82%
                  </strong>

                </div>

                <div className="resource-progress-track">

                  <div
                    className="resource-progress-fill icu-fill"
                    style={{ width: "82%" }}
                  />

                </div>

                <small>
                  Monitor closely
                </small>

              </div>


              {/* GENERAL BEDS */}

              <div className="resource-progress-item">

                <div className="resource-progress-header">

                  <div className="resource-progress-name">

                    <BedDouble size={15} />

                    <span>
                      General Beds
                    </span>

                  </div>

                  <strong>
                    76%
                  </strong>

                </div>

                <div className="resource-progress-track">

                  <div
                    className="resource-progress-fill beds-fill"
                    style={{ width: "76%" }}
                  />

                </div>

                <small>
                  Capacity healthy
                </small>

              </div>


              {/* STAFF */}

              <div className="resource-progress-item">

                <div className="resource-progress-header">

                  <div className="resource-progress-name">

                    <UsersRound size={15} />

                    <span>
                      Staff Coverage
                    </span>

                  </div>

                  <strong>
                    74%
                  </strong>

                </div>

                <div className="resource-progress-track">

                  <div
                    className="resource-progress-fill staff-fill"
                    style={{ width: "74%" }}
                  />

                </div>

                <small>
                  Staffing level optimal
                </small>

              </div>

            </div>

          </div>


          {/* AI RECOMMENDATION */}

          <div className="allocation-recommendation">

            <div className="recommendation-icon">
              <Sparkles size={18} />
            </div>

            <div className="recommendation-content">

              <span>
                AI RECOMMENDATION
              </span>

              <strong>
                Prepare additional emergency capacity
              </strong>

              <p>
                Current patterns indicate increasing Emergency
                and ICU pressure over the next 6 hours.
              </p>

            </div>

            <div className="recommendation-confidence">

              <TrendingUp size={16} />

              <span>
                92%
              </span>

              <small>
                confidence
              </small>

            </div>

          </div>

        </article>


        {/* ===================================================
            AI INSIGHT
        ==================================================== */}

        <article className="insight-card">

          <div className="insight-top">

            <div className="insight-icon">
              <Sparkles size={27} />
            </div>

            <span>
              AI ACTIVE
            </span>

          </div>

          <p className="insight-label">
            INTELLIGENT INSIGHT
          </p>

          <h2>
            Demand spike
            <br />
            predicted
          </h2>

          <p className="insight-description">
            Emergency and ICU demand is expected to increase
            over the next 6 hours based on current admission
            patterns.
          </p>

          <div className="insight-footer">

            <div className="insight-footer-icon">
              <Activity size={18} />
            </div>

            <span>
              AI recommendation ready
            </span>

          </div>

        </article>

      </section>


      {/* =====================================================
          RESOURCE OVERVIEW
      ====================================================== */}

      <section className="resource-strip">

        <div className="resource-card">

          <div className="resource-icon blue">
            <BedDouble size={21} />
          </div>

          <div>
            <span>
              BED UTILIZATION
            </span>

            <strong>
              76%
            </strong>
          </div>

          <small>
            Healthy
          </small>

        </div>


        <div className="resource-card">

          <div className="resource-icon green">
            <HeartPulse size={21} />
          </div>

          <div>
            <span>
              ICU CAPACITY
            </span>

            <strong>
              82%
            </strong>
          </div>

          <small>
            Monitor
          </small>

        </div>


        <div className="resource-card">

          <div className="resource-icon purple">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>
              APPOINTMENTS
            </span>

            <strong>
              128
            </strong>
          </div>

          <small>
            +14% week
          </small>

        </div>


        <div className="resource-card">

          <div className="resource-icon cyan">
            <UsersRound size={21} />
          </div>

          <div>
            <span>
              ACTIVE STAFF
            </span>

            <strong>
              152
            </strong>
          </div>

          <small>
            On duty
          </small>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;