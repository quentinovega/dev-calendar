import classNames from 'classnames';
import { eachMonthOfInterval, format, isSameDay, isToday, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import events from './events.json';



export const eventType = {
  CONF_INTERNE: "Conférence interne",
  PIZZA: "Pizza conf",
  HANDSON: "Hands on",
  CONF_EXTERNE: "Conférence externe",
  DEJ: "Petit dej.",
  PLENIERE: "Plénière"
}

interface IEventString {
  date: string
  title: string
  type: string
  link?: string
}
type EventsString = Array<IEventString>

interface IEvent {
  date: Date
  title: string
  type: string,
  link?: string
}


export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<IEvent>()

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear())
  

  const actualEvents = events
    .map<IEvent>(e => ({ ...e, date: parse(e.date, 'dd/MM/yyyy', new Date()) }))
    .filter(e => {
      return isSameDay(selectedDate, e.date)
    })

  const AVAILABLE_WEEK_DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const range = (number: number) => {
    return new Array(number)
      .fill(0)
      .map((_, i) => i);

  }

  const getMonthAndYear = (time: Date) => {
    let date = new Date(time);
    return {
      year: date.getFullYear(),
      month: date.getMonth()
    }
  }

  const countOfDaysInMonth = (time: Date) => {
    let date = getMonthAndYear(time);
    return new Date(date.year, date.month + 1, 0).getDate();
  }

  const getStartedDayOfWeekByTime = (time: Date) => {
    let date = getMonthAndYear(time);
    return new Date(date.year, date.month, 1).getDay();
  }

  const getCalendar = () => {
    let time = new Date(year, month, 1);

    return {
      active: {
        days: countOfDaysInMonth(time),
        startWeek: getStartedDayOfWeekByTime(time),
        day: time.getDate(),
        week: time.getDay(),
        month: time.getMonth(),
        year: time.getFullYear(),
        formatted: format(time, 'dd/mm/yyyy', { locale: fr }),
        tm: +time
      },
      pMonth: new Date(time.getFullYear(), time.getMonth() - 1, 1),
      nMonth: new Date(time.getFullYear(), time.getMonth() + 1, 1),
      pYear: new Date(new Date(time).getFullYear() - 1, 0, 1),
      nYear: new Date(new Date(time).getFullYear() + 1, 0, 1)
    }
  }

  const getDays = () => {
    const calendar = getCalendar()
    const allEvents = events.map<IEvent>(e => ({ ...e, date: parse(e.date, 'dd/MM/yyyy', new Date()) }))

    const latestDaysInPrevMonth = range(calendar.active.startWeek)
      .map((_, idx) => {
        const day: Date = new Date(calendar.pMonth.getFullYear(), calendar.pMonth.getMonth(), countOfDaysInMonth(calendar.pMonth) - idx)
        return {
          day,
          dayNumber: countOfDaysInMonth(calendar.pMonth) - idx,
          month: new Date(calendar.pMonth).getMonth(),
          year: new Date(calendar.pMonth).getFullYear(),
          currentMonth: false,
          hasEvent: allEvents.some(e => isSameDay(e.date, day))
        }
      }).reverse();

    const daysInActiveMonth = range(calendar.active.days).map((_, idx) => {
      let dayNumber: number = idx + 1;
      const day = new Date(year, calendar.active.month, dayNumber);
      return {
        day,
        dayNumber,
        month: calendar.active.month,
        year: calendar.active.year,
        currentMonth: true,
        hasEvent: allEvents.some(e => isSameDay(e.date, day))
      }
    });


    let countOfDays = 42 - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
    let daysInNextMonth = range(countOfDays).map((_, idx) => {
      const day: Date = new Date(calendar.nMonth.getFullYear(), calendar.nMonth.getMonth(), idx + 1)
      return {
        day,
        dayNumber: idx + 1,
        month: new Date(calendar.nMonth).getMonth(),
        year: new Date(calendar.nMonth).getFullYear(),
        currentMonth: false,
        hasEvent: allEvents.some(e => isSameDay(e.date, day))
      }
    });

    return [...latestDaysInPrevMonth, ...daysInActiveMonth, ...daysInNextMonth];
  }

  return (
    <div className='calendar-container'>
      <div className='p-2 d-flex flex-column'>
        <div className="calendar disable-selection" id="calendar">
          <div className="left-side">
            <div className="current-day text-center">
              <div className="calendar-left-side-day-of-week">{format(selectedDate, 'EEEE', { locale: fr })}</div>
              <h1 className="calendar-left-side-day">{format(selectedDate, 'dd', { locale: fr })}</h1>
              <div className="calendar-left-side-day-of-week">{`${format(selectedDate, 'MMMM', { locale: fr })} ${format(selectedDate, 'yyyy', { locale: fr })}`}</div>
            </div>
            {!selectedEvent && <div className="current-day-events">
              <div className='mb-2'>Évenements :</div>
              <ul className="current-day-events-list">
                {actualEvents.map((event, idx) => {
                  const display = <div className="d-flex align-items-center">
                    <span className='me-2'>{eventFormatter(event)}</span>
                    <span>{event.title}</span>
                  </div>
                  return (
                    <li key={idx}>
                      {event.link && <a href={event.link || '#'} target="_blank">
                        {display}
                      </a>}
                      {!event.link && display}
                    </li>
                  )
                })}
              </ul>
            </div>}
          </div>
          <div className="right-side">
            <div className="text-right calendar-change-year">
              <div className="calendar-change-year-slider">
                <span
                  className="fa fa-caret-left cursor-pointer calendar-change-year-slider-prev"
                  onClick={() => setYear(year - 1)} />
                <span className="calendar-current-year">{year}</span>
                <span
                  className="fa fa-caret-right cursor-pointer calendar-change-year-slider-next"
                  onClick={() => setYear(year + 1)} />
              </div>
            </div>
            <div className="calendar-month-list">
              <ul className="calendar-month">
                {eachMonthOfInterval({
                  start: new Date(year, 0, 1),
                  end: new Date(year, 11, 30)
                }).map(m => {
                  return (
                    <li
                      className={classNames({active: m.getMonth() === month})}
                      key={m.getMonth()}
                      onClick={() => setMonth(m.getMonth())}>
                      {format(m, 'MMM', { locale: fr })}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="calendar-week-list">
              <ul className="calendar-week">
                {AVAILABLE_WEEK_DAYS.map(week => {
                  return (
                    <li key={week}>{week}</li>
                  )
                })}
              </ul>
            </div>
            <div className="calendar-day-list">
              <ul className="calendar-days">{getDays().map((day, idx) => {
                return (
                  <li
                    key={idx}
                    className={classNames({
                      'another-month': !day.currentMonth,
                      'active-day': isToday(day.day),
                      'selected-day': isSameDay(day.day, selectedDate),
                      'event-day': day.hasEvent
                    })}
                    data-day={day.dayNumber}
                    data-month={day.month}
                    data-year={day.year}
                    onClick={() => {
                      setSelectedDate(day.day)
                    }} />
                )
              })}</ul>
            </div>
          </div>
        </div>

      </div>





    </div >
  )
}

const eventFormatter = (event: IEvent) => {
  switch (event.type) {
    case 'PIZZA':
      return <i title={eventType[event.type]} className="fa-sharp fa-solid fa-pizza-slice" />
    case 'HANDSON':
      return <i title={eventType[event.type]} className="fa-solid fa-laptop-code" />
    case 'DEJ':
      return <i title={eventType[event.type]} className="fa-solid fa-croissant" />
    case 'CONF_INTERNE':
    case 'CONF_EXTERNE':
      return <i title={eventType[event.type]} className="fa-solid fa-microphone" />
    case 'PLENIERE':
      return <i title={eventType[event.type]} className="fa-solid fa-users" />
  }
}