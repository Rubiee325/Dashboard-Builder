import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BarChart2, Table as TableIcon, Activity, PieChart, TrendingUp, Maximize2, MousePointer2 } from 'lucide-react';

const WidgetSidebar = ({onAdd}) => {
  return (
    <aside className="w-80 bg-white border-r border-[#E2E8F0] p-8 overflow-y-auto">
      <div className="mb-10">
          <h3 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">Available Components</h3>
          <p className="text-xs text-[#64748B] font-medium leading-relaxed">Drag and drop components to the draft area to build your interface.</p>
      </div>
      
      <div className="space-y-10">
        <section>
          <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Charts
          </h4>
          <div className="grid gap-4">

  <DraggableWidget
    type="Chart"
    title="Bar Chart"
    icon={<BarChart2 size={20} />}
    onAdd={onAdd}
  />

  <DraggableWidget
    type="Chart"
    title="Line Chart"
    icon={<TrendingUp size={20} />}
    onAdd={onAdd}
  />

  <DraggableWidget
    type="Chart"
    title="Pie Chart"
    icon={<PieChart size={20} />}
    onAdd={onAdd}
  />

  <DraggableWidget
    type="Chart"
    title="Area Chart"
    icon={<Activity size={20} />}
    onAdd={onAdd}
  />

  <DraggableWidget
    type="Chart"
    title="Scatter Plot"
    icon={<MousePointer2 size={20} />}
    onAdd={onAdd}
  />

</div>
        </section>

        <section>
          <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Tables
          </h4>
          <div className="grid gap-4">
             <DraggableWidget type="Table" title="Table" icon={<TableIcon size={20} />}onAdd={onAdd} />
          </div>
        </section>

        <section>
          <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#54bd95]"></div> KPIs
          </h4>
          <div className="grid gap-4">
             <DraggableWidget type="KPI" title="KPI Value" icon={<TrendingUp size={20} />}onAdd={onAdd} />
          </div>
        </section>
      </div>
    </aside>
  );
};

const DraggableWidget = ({ type, title, icon, onAdd }) => {

  return (
    <div
      onClick={() => onAdd(type, title)}
      className="flex items-center gap-4 p-5 rounded-3xl border-2 border-[#F1F5F9] bg-white hover:border-[#54bd95] hover:shadow-xl hover:shadow-[#54bd95]/10 cursor-pointer transition-all group"
    >

      <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] group-hover:bg-[#54bd95]/10 group-hover:text-[#54bd95] text-[#94A3B8] flex items-center justify-center">
        {icon}
      </div>

      <span className="text-sm font-bold text-[#475569] group-hover:text-[#0F172A]">
        {title}
      </span>

    </div>
  );
};

export default WidgetSidebar;
