import { Application } from 'express';
import axios from 'axios';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      // An example of connecting to the backend (a starting point)
      // const response = await axios.get('http://localhost:4000/get-example-case');
      // console.log(response.data);
      res.render('home', {});
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.post('/task/create', async (req, res) => {
    let errors: Record<string, string> = {};
    let data = req.body;

    let title = req.body.title;
    let status = req.body.status;

  if (!title) errors.title = "Title is required";
  if (!status) errors.status = "Status is required";

    let day = parseIntSafe(data.day);
    let month = parseIntSafe(data.month);
    let year = parseIntSafe(data.year);
    let hour = parseIntSafe(data.hour);
    let minute = parseIntSafe(data.minute);

    if (
      [day, month, year, hour, minute].some(v => v === null) ||
      day! < 1 || day! > 31 ||
      month! < 1 || month! > 12 ||
      hour! < 0 || hour! > 23 ||
      minute! < 0 || minute! > 59
    ) {
      errors.datetime = "Must enter a valid due date and time";
    }

    if (Object.keys(errors).length > 0) {
      return res.render('home', {
        errors,
        data
      })
    }

    let request = {
      "title": title,
      "description": req.body.description,
      "status": status,
      "dueDateTime": new Date(Date.UTC(year!, month! - 1, day!, hour!, minute!, 0)).toISOString()
    }

    try {
      const response = await axios.post('http://localhost:8080/task/create', request, {
        headers: { 'Content-Type': 'application/json' } 
      });
      console.log(response.data);
      res.render('home', { "task": response.data })

    } catch (errors) {
      console.error('Error making request', errors);
      res.render('home', { errors })
    }
  


  function parseIntSafe(value: any): number | null {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }
})

};
