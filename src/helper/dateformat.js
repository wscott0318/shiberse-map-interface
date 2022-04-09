import React, { useState, useEffect } from 'react';

export const DateFormat = ( { data } ) => {
  Date.prototype.getMonthName = function () {
    var monthNames = [
      'Jan.',
      'Feb.',
      'Mar.',
      'Apr.',
      'May',
      'June',
      'July',
      'Aug.',
      'Sep.',
      'Oct.',
      'Nov.',
      'Dec.',
    ];
    return monthNames[this.getMonth()];
  };

  
  const [date, setDate] = useState( {
    month: '',
    date: '',
    year: '',
  } );

  useEffect( () => {
    const fullDate = new Date( data );
    setDate( {
      month: fullDate.getMonthName(),
      date: fullDate.getDate(),
      year: fullDate.getFullYear(),
    } );
  }, [data] );
  return <>{`${date.month} ${date.date}, ${date.year}`}</>;
};

export const DateTimeFormat = ( { data } ) => {
  Date.prototype.getMonthName = function () {
    var monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return monthNames[this.getMonth()];
  };

  
  const [date, setDate] = useState( {
    month: '',
    date: '',
    year: '',
  } );

  useEffect( () => {
    const fullDate = new Date( data );
    setDate( {
      month: fullDate.getMonthName(),
      date: fullDate.getDate(),
      year: fullDate.getFullYear(),
      hours: fullDate.getHours(),
      minutes: fullDate.getMinutes()
    } );
  }, [data] );
  return <>{`${date.date} ${date.month} ${date.year}, ${date.hours}:${date.minutes}`}</>;
};