import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';

import { useTheme } from '@/context/theme-context';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import '@schedule-x/theme-default/dist/index.css';
import { useEffect, useState } from 'react';

const Calendar = ({ data }: { data: any }) => {
  const { theme } = useTheme();

  // Get the effective theme (handles 'system' theme)
  const getEffectiveTheme = () => {
    if (theme === 'system') {
      return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
    }
    return theme;
  };

  const effectiveTheme = getEffectiveTheme();

  const eventsService = useState(() => createEventsServicePlugin())[0];
  const eventModal = createEventModalPlugin();

  // Create calendar with dynamic theme
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    isDark: effectiveTheme === 'dark',
    events: data,
    plugins: [eventsService, eventModal],
    calendars: {
      work: {
        colorName: 'work',
        lightColors: {
          main: '#3b82f6',
          container: '#dbeafe',
          onContainer: '#1e40af',
        },
        darkColors: {
          main: '#60a5fa',
          container: '#1e3a8a',
          onContainer: '#dbeafe',
        },
      },
      personal: {
        colorName: 'personal',
        lightColors: {
          main: '#10b981',
          container: '#d1fae5',
          onContainer: '#047857',
        },
        darkColors: {
          main: '#34d399',
          container: '#064e3b',
          onContainer: '#d1fae5',
        },
      },
    },
    // Enhanced calendar configuration
    defaultView: createViewMonthGrid().name,
    selectedDate: '2025-08-12',
    firstDayOfWeek: 1, // Monday
    dayBoundaries: {
      start: '06:00',
      end: '22:00',
    },
    weekOptions: {
      gridHeight: 800,
      eventWidth: 95,
      timeAxisFormatOptions: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      eventOverlap: true,
      nDays: 7,
    },
    monthGridOptions: {
      nEventsPerDay: 4,
    },

    showWeekNumbers: true,
    isResponsive: true,
    locale: 'en-US',
    callbacks: {
      onEventClick(calendarEvent) {
        console.log('Event clicked:', calendarEvent);
      },
      onEventUpdate(updatedEvent) {
        console.log('Event updated:', updatedEvent);
      },
      onClickDate(date) {
        console.log('Date clicked:', date);
      },
      onClickDateTime(dateTime) {
        console.log('Date time clicked:', dateTime);
      },
      onRangeUpdate(range) {
        console.log('Calendar range updated:', range);
      },
    },
  });

  // Update calendar theme when theme changes
  useEffect(() => {
    if (calendar) {
      calendar.setTheme(effectiveTheme === 'dark' ? 'dark' : 'light');
    }
  }, [effectiveTheme, calendar]);

  useEffect(() => {
    // Initialize events
    eventsService.getAll();
  }, [eventsService]);

  return (
    <>
      <ScheduleXCalendar calendarApp={calendar} />
      {/* Custom CSS for better calendar styling */}
      <style>{`
    .calendar-container {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
    }

    .calendar-wrapper {
      min-height: 600px;
    }

    /* Enhanced calendar theme integration */
    :global(.sx__calendar) {
      font-family: inherit !important;
      border-radius: 0.5rem !important;
      overflow: hidden !important;
    }

    :global(.sx__calendar.sx__is-dark) {
      background-color: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
    }

    :global(.sx__calendar:not(.sx__is-dark)) {
      background-color: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
    }

    /* Header styling */
    :global(.sx__calendar-header) {
      border-bottom: 1px solid hsl(var(--border)) !important;
      padding: 1rem !important;
      background-color: hsl(var(--muted)) !important;
    }

    /* View buttons */
    :global(.sx__calendar-header .sx__button) {
      border: 1px solid hsl(var(--border)) !important;
      background-color: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
      transition: all 0.2s ease !important;
    }

    :global(.sx__calendar-header .sx__button:hover) {
      background-color: hsl(var(--accent)) !important;
      border-color: hsl(var(--accent-foreground)) !important;
    }

    :global(.sx__calendar-header .sx__button.sx__is-selected) {
      background-color: hsl(var(--primary)) !important;
      color: hsl(var(--primary-foreground)) !important;
      border-color: hsl(var(--primary)) !important;
    }

    /* Navigation buttons */
    :global(.sx__calendar-header .sx__chevron-wrapper) {
      background-color: hsl(var(--background)) !important;
      border: 1px solid hsl(var(--border)) !important;
      border-radius: 0.375rem !important;
    }

    :global(.sx__calendar-header .sx__chevron-wrapper:hover) {
      background-color: hsl(var(--accent)) !important;
    }

    /* Month/week grid improvements */
    :global(.sx__month-grid-day) {
      border: 1px solid hsl(var(--border)) !important;
      transition: background-color 0.2s ease !important;
    }

    :global(.sx__month-grid-day:hover) {
      background-color: hsl(var(--accent)) !important;
    }

    :global(.sx__month-grid-day.sx__is-today) {
      background-color: hsl(var(--accent)) !important;
      font-weight: 600 !important;
    }

    /* Week view styling */
    :global(.sx__week-grid) {
      border: 1px solid hsl(var(--border)) !important;
    }

    :global(.sx__time-grid-hour) {
      border-bottom: 1px solid hsl(var(--border)) !important;
    }

    /* Event styling improvements */
    :global(.sx__event) {
      border-radius: 0.25rem !important;
      font-weight: 500 !important;
      font-size: 0.875rem !important;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1) !important;
    }

    :global(.sx__event:hover) {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
      transform: translateY(-1px) !important;
      transition: all 0.2s ease !important;
    }

    /* Today indicator */
    :global(.sx__today-indicator) {
      background-color: hsl(var(--primary)) !important;
      border-radius: 50% !important;
      width: 8px !important;
      height: 8px !important;
    }

    /* Responsive improvements */
    @media (max-width: 768px) {
      .calendar-wrapper {
        padding: 0.5rem !important;
        min-height: 500px;
      }

      :global(.sx__calendar-header) {
        padding: 0.5rem !important;
        flex-wrap: wrap !important;
      }

      :global(.sx__calendar-header .sx__button) {
        font-size: 0.875rem !important;
        padding: 0.25rem 0.5rem !important;
      }
    }
  `}</style>
    </>
  );
};

export default Calendar;
