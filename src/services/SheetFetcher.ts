import axios from 'axios';
import { SPREADSHEET_ID } from '../config';
import { parseCSV } from '../utils';

export async function fetchSheetData(sheetName: string): Promise<Record<string, string>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await axios.get(url);
  return parseCSV(response.data);
}
