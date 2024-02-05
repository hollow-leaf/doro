'use client'

import { useEffect } from 'react';
import { redirect } from "next/navigation";

export default function Index() {
  redirect("/client");

  return null
}