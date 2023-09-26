import React, { useEffect, useState } from 'react';
import { getConversationList } from './api/comments';
import { Message } from './types/Message';
import { Conversation } from './components/Conversation';
import { CommentForm } from './components/CommentForm';
import { Order } from './types/Order';
import { Sort } from './types/Sort';
import { useSearchParams } from 'react-router-dom';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Button } from '@mui/material';
import { Loader } from './components/Loader';
import { createPagesArr } from './utils/createPagesArr';

export const App: React.FC = () => {
  const [conversationList, setConversationList] = useState<Message[]>([]);
  const [messageId, setMessageId] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [order, setOrder] = useState(Order.Ascending);
  const [sort, setSort] = useState(Sort.Date);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const { data } = await getConversationList(order, sort, currentPage);
      const { conversations, pages } = data;

      setPages(createPagesArr(pages));
      setConversationList(conversations);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setSearchParams({ order, sort, page: String(currentPage) });

    load();
  }, [order, sort, currentPage]);

  return (
    <>
      <main className="container">
        <CommentForm onLoad={load} />

        <div className="menu">
          <Button
            variant="contained"
            type="button"
            onClick={() => {
              const order = searchParams.get('order') || Order.Ascending;
              setOrder(
                order === Order.Ascending ? Order.Descending : Order.Ascending
              );
            }}
          >
            <ImportExportIcon />
          </Button>

          <Button
            variant="contained"
            type="button"
            onClick={() => {
              setSort(Sort.UserName);
            }}
            disabled={sort === 'user-name'}
          >
            <PersonIcon />
          </Button>

          <Button
            variant="contained"
            type="button"
            onClick={() => {
              setSort(Sort.Email);
            }}
            disabled={sort === 'email'}
          >
            <AlternateEmailIcon />
          </Button>

          <Button
            variant="contained"
            type="button"
            onClick={() => {
              setSort(Sort.Date);
            }}
            disabled={sort === 'created-at'}
          >
            <AccessTimeIcon />
          </Button>
        </div>

        {isLoading && <Loader />}

        {conversationList.map((message) => (
          <Conversation
            key={message.id}
            message={message}
            currentFormId={messageId}
            onSetCurrentFormId={(value) => setMessageId(value)}
            onLoad={load}
          />
        ))}

        <article className="pagination">
          {pages.map((page) => (
            <button
              key={page}
              className="pagination__button"
              type="button"
              onClick={() => setCurrentPage(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          ))}
        </article>
      </main>
    </>
  );
};
