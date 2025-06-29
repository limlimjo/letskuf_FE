const Pagination = props => {
  console.log('props 확인');
  console.log(props);

  let paginationTag = [];

  if (props.pagination === undefined) {
    paginationTag = '-';
  } else {
    const currentPageNo = props.pagination.currentPageNo;
    const pageSize = props.pagination.pageSize;
    const totalRecordCount = props.pagination.totalRecordCount;
    const recordCountPerPage = props.pagination.recordCountPerPage;

    const totalPageCount = Math.ceil(totalRecordCount / recordCountPerPage);
    const currentFirstPage =
      Math.floor((currentPageNo - 1) / pageSize) * pageSize + 1;
    let currentLastPage = currentFirstPage + pageSize - 1;
    currentLastPage =
      currentLastPage > totalPageCount ? totalPageCount : currentLastPage;

    if (totalPageCount > pageSize) {
      // 첫 페이지 이동
      const firstPageTag = (
        <li key="fp">
          <button
            onClick={() => {
              props.moveToPage(1);
            }}
            className="first"
          >
            처음
          </button>
        </li>
      );
      paginationTag.push(firstPageTag);

      // 이전 페이지 이동
      const prevPageIndex = currentPageNo - 1 > 0 ? currentPageNo - 1 : 1;
      const previousPageTag = (
        <li key="pp" className="btn">
          <button
            onClick={() => {
              props.moveToPage(prevPageIndex);
            }}
            className="prev"
          >
            이전
          </button>
        </li>
      );
      paginationTag.push(previousPageTag);
    }

    for (let i = currentFirstPage; i <= currentLastPage; i++) {
      if (i === currentPageNo) {
        // 현재 페이지
        const currentPage = (
          <li key={i} className="px-3 py-1 rounded bg-gray-800 text-white">
            <button>{i}</button>
          </li>
        );
        paginationTag.push(currentPage);
      } else {
        console.log('다른 페이지 출력');
        // 다른 페이지
        const otherPage = (
          <li key={i} className="px-3 py-1 rounded bg-gray-200">
            <button
              onClick={() => {
                console.log('페이지 버튼 클릭');
                props.moveToPage(i);
              }}
            >
              {i}
            </button>
          </li>
        );

        console.log('다른 페이지 출력2');
        console.log(otherPage);
        paginationTag.push(otherPage);
      }
    }
    if (totalPageCount > pageSize) {
      // 다음 페이지 이동
      const nextPageIndex =
        currentLastPage + 1 < totalPageCount
          ? currentLastPage + 1
          : totalPageCount;
      const nextPageTag = (
        <li key="np" className="btn">
          <button
            onClick={() => {
              props.moveToPage(nextPageIndex);
            }}
            className="next"
          >
            다음
          </button>
        </li>
      );
      paginationTag.push(nextPageTag);

      // 마지막 페이지 이동
      const lastPageTag = (
        <li key="lp" className="btn">
          <button
            onClick={() => {
              props.moveToPage(totalPageCount);
            }}
            className="last"
          ></button>
        </li>
      );
      paginationTag.push(lastPageTag);
    }
  }

  return (
    // <div className="flex justify-center items-center mt-6 space-x-2">
    //   <button
    //     className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
    //     disabled
    //   >
    //     이전
    //   </button>
    //   <button className="px-3 py-1 rounded bg-gray-800 text-white">1</button>
    //   <button className="px-3 py-1 rounded bg-gray-200">2</button>
    //   <button className="px-3 py-1 rounded bg-gray-200">3</button>
    //   <button className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400">
    //     다음
    //   </button>
    // </div>
    <div>
      <ul className="flex justify-center items-center mt-6 space-x-2">
        {paginationTag}
      </ul>
    </div>
  );
};

export default Pagination;
