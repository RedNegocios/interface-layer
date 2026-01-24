import React, { useEffect, useState } from "react";
import { buildApiUrl, getFetchOptions } from "../config/api";
import "./BooksList.css";

const BooksList = ({ category, page = 1, size = 5 }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar endpoint directo sin categoría en la ruta
        const url = `http://localhost:8080/negocios/api/colecciones?page=${page}&size=${size}`;
        const response = await fetch(url, getFetchOptions("GET"));

        if (!response.ok) {
          throw new Error("Error al cargar los libros");
        }

        const data = await response.json();
        setBooks(data.productos || data || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category, page, size]);

  if (loading) {
    return (
      <div className="books-list-loading">
        <div className="spinner"></div>
        <span>Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="books-list-error">
        <span>❌</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="books-list-empty">
        <span>📚</span>
        <p>No hay libros disponibles en esta categoría</p>
      </div>
    );
  }

  return (
    <ul className="books-list">
      {books.map((book, index) => (
        <li key={book.id || index} className="book-item">
          <span className="book-bullet">•</span>
          <div className="book-info">
            <span className="book-title">
              {book.nombre || book.title || "Sin título"}
            </span>
            {book.autor && <span className="book-author"> - {book.autor}</span>}
            {book.precio && <span className="book-price"> ${book.precio}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BooksList;
