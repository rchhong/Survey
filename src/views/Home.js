import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div class="main">
      <h1>Logs</h1>
      <div class="button-container">
        <a href="/survey/visitors" class="button">
          Visitor Log
        </a>
        <a href="/edit/visitors" class="button">
          Edit Visitor Log
        </a>
        <a href="/survey/team" class="button">
          Team Member Log
        </a>
        <a href="edit/team" class="button">
          Edit Team Member Log
        </a>
        <a href="/survey/residents" class="button">
          Resident Log
        </a>
        <a href="/edit/residents" class="button">
          Edit Resident Log
        </a>
      </div>
    </div>
  );
}
