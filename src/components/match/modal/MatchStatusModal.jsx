import { useEffect, useState } from 'react';
import Button from '../../common/Button';

const MatchStatusModal = ({
  open,
  status,
  minute,
  onClose,
  onSave,
}) => {

  const [extraMinute, setExtraMinute] = useState(0);


  // 추가시간 입력 표시 여부
  const showExtraMinute =
    status === 'HALF_TIME' ||
    status === 'FINISHED';


  // 모달 열릴 때 초기화
  useEffect(() => {

    if (open) {
      setExtraMinute(0);
    }

  }, [open]);


  if (!open) {
    return null;
  }


  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
      "
    >

      <div
        className="
          w-96
          rounded-xl
          bg-white
          p-6
          shadow-xl
        "
      >

        <h3
          className="
            mb-5
            text-xl
            font-bold
            text-gray-800
          "
        >
          경기 상태 변경
        </h3>


        {/* 경기 시간 */}
        <div
          className="
            mb-5
            rounded-lg
            bg-blue-50
            p-4
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            변경 시간
          </div>


          <div
            className="
              mt-1
              text-2xl
              font-bold
              text-blue-600
            "
          >
            {minute}분
          </div>

        </div>



        {/* 추가시간 */}
        {showExtraMinute && (

          <div
            className="
              mb-6
              rounded-lg
              border
              border-orange-200
              bg-orange-50
              p-4
            "
          >

            <div
              className="
                mb-3
                flex
                items-center
                justify-between
              "
            >

              <label
                className="
                  font-semibold
                  text-orange-700
                "
              >
                ⏱ 추가시간
              </label>


              <span
                className="
                  text-xs
                  text-orange-400
                "
              >
                분 단위
              </span>

            </div>



            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <input
                type="number"
                min="0"
                value={extraMinute}
                onChange={(e) =>
                  setExtraMinute(
                    Number(e.target.value)
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-orange-300
                  bg-white
                  px-3
                  py-2
                  text-center
                  text-lg
                  font-bold
                  outline-none
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-200
                "
              />


              <span
                className="
                  font-semibold
                  text-gray-600
                "
              >
                분
              </span>

            </div>

          </div>

        )}



        {/* 버튼 */}
        <div
          className="
            flex
            justify-end
            gap-3
          "
        >

          <Button
            className="
              rounded-lg
              bg-gray-200
              px-5
              py-2
              font-semibold
              text-gray-700
              hover:bg-gray-300
            "
            onClick={onClose}
          >
            취소
          </Button>


          <Button
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2
              font-semibold
              text-white
              hover:bg-blue-700
            "
            onClick={() =>
              onSave(
                status,
                minute,
                extraMinute
              )
            }
          >
            확인
          </Button>

        </div>


      </div>

    </div>
  );
};

export default MatchStatusModal;