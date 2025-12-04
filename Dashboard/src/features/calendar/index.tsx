import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { ThemeSwitch } from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Download } from 'lucide-react';
import { useMemo } from 'react';
import Calendar from './components/Calendar';
import { toast } from 'sonner';

export default function Dashboard() {
  const handleAddEvent = () => {
    // This would typically open a modal or navigate to an add event form
    toast.error('Add event clicked');
  };

  const handleExport = () => {
    // This would export calendar data
    toast.error('Export clicked');
  };

  const sampleEvents = useMemo(
    () => [
      {
        id: '1',
        title: 'Team Standup',
        start: '2025-08-16 09:00',
        end: '2025-08-16 09:30',
        people: ['Development Team'],
        location: 'Conference Room A',
        calendarId: 'work',
      },
      {
        id: '2',
        title: 'Project Review Meeting',
        start: '2025-08-12 09:00',
        end: '2025-08-12 11:00',
        people: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        location: 'Zoom Meeting',
        calendarId: 'work',
      },
      {
        id: '3',
        title: 'Client Presentation',
        start: '2025-08-13 14:00',
        end: '2025-08-13 16:00',
        people: ['Sales Team', 'Client'],
        location: 'Boardroom',
        calendarId: 'work',
      },
      {
        id: '4',
        title: 'Code Review Session',
        start: '2025-08-14 15:30',
        end: '2025-08-14 17:00',
        people: ['Dev Team'],
        location: 'Development Lab',
        calendarId: 'work',
      },
      {
        id: '5',
        title: 'Lunch Break',
        start: '2025-08-12 12:00',
        end: '2025-08-12 13:00',
        people: [],
        location: 'Cafeteria',
        calendarId: 'personal',
      },
      {
        id: '6',
        title: 'Sprint Planning',
        start: '2025-08-15 10:00',
        end: '2025-08-15 12:00',
        people: ['Scrum Team'],
        location: 'Planning Room',
        calendarId: 'work',
      },
    ],
    []
  );
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Calendar
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage your schedule and upcoming events
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <Button variant='outline' size='sm' onClick={handleExport}>
              <Download className='mr-2 h-4 w-4' />
              Export
            </Button>
            <Button
              size='sm'
              onClick={handleAddEvent}
              className='bg-primary hover:bg-primary/90'>
              <CalendarPlus className='mr-2 h-4 w-4' />
              Add Event
            </Button>
          </div>
        </div>

        {/* Calendar Container with enhanced styling */}
        <div className='calendar-container rounded-xl border bg-card shadow-sm overflow-hidden'>
          <div className='calendar-wrapper p-4'>
            <Calendar data={sampleEvents} />
          </div>
        </div>
      </Main>
    </>
  );
}
