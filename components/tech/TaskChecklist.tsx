'use client';

interface TaskChecklistProps {
  tasks: {
    skim: boolean;
    brush: boolean;
    vacuum: boolean;
    baskets: boolean;
    filter: boolean;
    equipment: boolean;
  };
  onToggle: (task: keyof TaskChecklistProps['tasks']) => void;
  requiredTasks?: (keyof TaskChecklistProps['tasks'])[];
}

const taskLabels: Record<keyof TaskChecklistProps['tasks'], { label: string; icon: string }> = {
  skim: { label: 'Skim', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  brush: { label: 'Brush', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  vacuum: { label: 'Vacuum', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  baskets: { label: 'Baskets', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
  filter: { label: 'Filter', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
  equipment: { label: 'Equip Check', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
};

export function TaskChecklist({ tasks, onToggle, requiredTasks = ['skim', 'brush', 'baskets'] }: TaskChecklistProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Service tasks checklist">
      {(Object.entries(tasks) as [keyof typeof tasks, boolean][]).map(([task, completed]) => {
        const { label, icon } = taskLabels[task];
        const isRequired = requiredTasks.includes(task);

        return (
          <button
            key={task}
            onClick={() => onToggle(task)}
            className={`relative flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-xl font-medium text-center transition-all active:scale-95 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800
              ${completed
                ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-surface-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-surface-600'
              }`}
            role="checkbox"
            aria-checked={completed}
            aria-label={`${label}${isRequired ? ' (required)' : ''}${completed ? ' - completed' : ''}`}
          >
            {/* Required indicator */}
            {isRequired && !completed && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full" aria-hidden="true" />
            )}

            {/* Icon */}
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>

            {/* Label with checkmark */}
            <span className="text-sm font-semibold">
              {completed && (
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
