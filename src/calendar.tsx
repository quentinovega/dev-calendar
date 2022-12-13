import classNames from 'classnames';
import { eachMonthOfInterval, format, isSameDay, isToday, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';



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


export const events: EventsString = [{
  "date": "01/06/2022",
  "title": "plenière dev",
  "type": eventType.PLENIERE
}, {
  "date": "05/12/2022",
  "title": "plenière dev",
  "type": eventType.PLENIERE
}, {
  date: "12/12/2022",
  title: 'comment  bien coder...',
  type: eventType.PIZZA,
},
{
  "date": "14/12/2022",
  "title": "DTC VII",
  "type": eventType.CONF_INTERNE,
  link: 'https://teams.microsoft.com/l/message/19:36172bb3d4074308a98d6740417018f9@thread.skype/1670920064934?tenantId=9c9d8823-ab9e-4ac4-8251-32c4a7ae50d5&groupId=c17dc0b1-875b-4fdc-aeb7-be47d785440a&parentMessageId=1670920064934&teamName=Les%20d%C3%A9veloppeurs&channelName=Conf%C3%A9rences%20et%20%C3%A9v%C3%A9nements%20guildes&createdTime=1670920064934&allowXTenantAccess=false'
}, {
  date: "10/01/2023",
  title: 'comment  mieux coder...',
  type: eventType.PIZZA
}]

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
    let calendar = getCalendar()

    let latestDaysInPrevMonth = range(calendar.active.startWeek)
      .map((_, idx) => {
        return {
          day: new Date(calendar.pMonth.getFullYear(), calendar.pMonth.getMonth(), countOfDaysInMonth(calendar.pMonth) - idx),
          dayNumber: countOfDaysInMonth(calendar.pMonth) - idx,
          month: new Date(calendar.pMonth).getMonth(),
          year: new Date(calendar.pMonth).getFullYear(),
          currentMonth: false
        }
      }).reverse();

    let daysInActiveMonth = range(calendar.active.days).map((day, idx) => {
      let dayNumber = idx + 1;
      return {
        day: new Date(year, calendar.active.month, dayNumber),
        dayNumber,
        month: calendar.active.month,
        year: calendar.active.year,
        currentMonth: true
      }
    });


    let countOfDays = 42 - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
    let daysInNextMonth = range(countOfDays).map((day, idx) => {
      return {
        day: new Date(calendar.nMonth.getFullYear(), calendar.nMonth.getMonth(), idx + 1),
        dayNumber: idx + 1,
        month: new Date(calendar.nMonth).getMonth(),
        year: new Date(calendar.nMonth).getFullYear(),
        currentMonth: false
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
              <div>Évenements :</div>
              <ul className="current-day-events-list">
                {actualEvents.map((event, idx) => {
                  return (
                    <li className='cursor-pointer'>
                      <a href={event.link || '#'} target="_blank">
                        <div className="d-flex align-items-center">
                          <span className='me-2'>{eventFormatter(event)}</span>
                          <span>{event.title}</span>
                        </div>
                      </a>
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
                }).map(month => {
                  return (
                    <li
                      key={month.getMonth()}
                      onClick={() => setMonth(month.getMonth())}>
                      {format(month, 'MMM', { locale: fr })}
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
                      // 'event-day': day.hasEvent
                    })}
                    data-day={day.dayNumber}
                    data-month={day.month}
                    data-year={day.year}
                    onClick={() => {
                      setSelectedDate(day.day)
                    }}>
                  </li>
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
    case eventType.PIZZA:
      return <i className="fa-sharp fa-solid fa-pizza-slice" />
    case eventType.HANDSON:
      return <i className="fa-solid fa-laptop-code" />
    case eventType.DEJ:
      return <i className="fa-solid fa-croissant" />
    case eventType.CONF_INTERNE:
    case eventType.CONF_EXTERNE:
      return <i className="fa-solid fa-microphone" />
    case eventType.PLENIERE:
      return <i className="fa-solid fa-poo" />
  }
}