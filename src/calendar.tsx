import React, { useState } from 'react';
import { getMonth, getYear, parse, addMonths, subMonths, format, compareAsc } from 'date-fns';
import { ArrowLeft, ArrowRight } from 'react-feather';

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
  place: string
  type: string
}
type EventsString = Array<IEventString>

interface IEvent {
  date: Date
  title: string
  place: string
  type: string
}


export const events: EventsString = [{
  "date": "01/06/2022",
  "title": "plenière dev",
  "place": "Niort",
  "type": eventType.PLENIERE
}, {
  "date": "05/12/2022",
  "title": "plenière dev",
  "place": "Niort",
  "type": eventType.PLENIERE
}, {
  date: "12/12/2022",
  title: 'comment  bien coder...',
  place: 'Niort',
  type: eventType.PIZZA
},
{
  "date": "15/12/2022",
  "title": "DTC VII",
  "place": "Niort",
  "type": eventType.CONF_INTERNE
}, {
  date: "10/01/2023",
  title: 'comment  mieux coder...',
  place: 'Niort',
  type: eventType.PIZZA
}]



type FourMonths = {
  date: Date,
  plusOne: Date,
  plusTwo: Date,
  // plusThree: Date
}

const getFourMonths = (date: Date): FourMonths => ({
  date: date,
  plusOne: addMonths(date, 1),
  plusTwo: addMonths(date, 2),
  // plusThree: addMonths(date, 3)
})

export const Calendar = () => {
  const [months, setMonths] = useState(getFourMonths(new Date()))
  const [year, setYear] = useState(parseInt(format(new Date(), 'yyyy')))

  const dateCorresp = (date1: Date, date2: Date): boolean => {
    return getMonth(date1) === getMonth(date2) && getYear(date1) === getYear(date2)
  }

  const actualEvents = events
    .map<IEvent>(e => ({ ...e, date: parse(e.date, 'dd/MM/yyyy', new Date()) }))
    .filter(e => {
      return Object.values(months).some(d => dateCorresp(d, e.date))
    })
    .reduce<{ [key: string]: IEvent[] }>((acc, event) => {
      const key = format(event.date, 'LLLL yyyy')

      return { ...acc, [key]: [...(acc[key] || []), event] }
    }, {})

  return (
    <div className='calendar-container'>

      <h1>Agenda des devs</h1>

      <div className='p-2 d-flex flex-column'>
        <div className='d-flex flex-wrap'>
          {Object.values(months)
            .map((date, idx) => {
              const keyDate = format(date, 'LLLL yyyy')
              const events = actualEvents[keyDate] || []

              return (
                <div key={idx} className='col-sm-4 col-12 p-2'>
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      {idx === 0 && (
                        <ArrowLeft className="cursor-pointer" onClick={() => {
                          setMonths(getFourMonths(subMonths(months.date, 1)))
                        }} />
                      )}
                      {keyDate}
                      {idx === 2 && (
                        <ArrowRight className="cursor-pointer" onClick={() => {
                          setMonths(getFourMonths(addMonths(months.date, 1)))
                        }} />
                      )}
                    </div>
                    <div className="card-body">
                      <div className='events-container'>
                        {events
                          .sort((a, b) => compareAsc(a.date, b.date))
                          .map(ev => {
                            const day = format(ev.date, 'iii dd')
                            return (
                              <div>{`${day}: ${ev.title}`}</div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

      </div>


      <div>
        <div className="year-selector d-flex align-items-center">
          <ArrowLeft className="cursor-pointer m-3" />
          <h1>{year}</h1>
          <ArrowRight className="cursor-pointer m-3" />
        </div>
        <div className='year-timeline'>
          {events
            .map<IEvent>(e => ({ ...e, date: parse(e.date, 'dd/MM/yyyy', new Date()) }))
            .filter(e => getYear(e.date) === 2022)
            .map(e => {
              const doy = parseInt(format(e.date, 'DDD'))
              const percent = doy / 365 * 100
              return (
                <div className="event-timeline" style={{ "--day-of-year": `${percent}%` } as React.CSSProperties}>
                  {eventFormatter(e)}
                </div>
              )
            })
          }
        </div>
      </div>


    </div>
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