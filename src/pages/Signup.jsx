import { TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import { styled } from 'styled-components'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { addUsers } from '../api/users'
import moment from 'moment/moment'
import { useNavigate } from 'react-router-dom'


function Signup() {
  const [imagePreview, setImagePreview] = useState(null)
  const [userid, setUserId] = useState('')
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userIdError, setUserIdError] = useState('')
  const [nameError, setNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)

  const navigate = useNavigate()
  // console.log(imagePreview)

  let file
  const ImageUploadHandler = (e) => {
    file = e.target.files[0]
    const reader = new FileReader()

    console.log('사진 : ', file)

    reader.onloadend = () => {
      setImagePreview(file) // 이미지 데이터를 그대로 설정
    }

    if (file) {
      reader.readAsArrayBuffer(file)
    }
  }

  const DuplicateCheck = () => {
    // 중복검사 로직
  }

  const SignUpClick = async () => {
    let isValid = true

    const useridRegex = /^[a-zA-Z0-9]{4,12}$/ // 영어 알파벳 4자리에서 12자리
    const nameRegex = /^[가-힣]{2,10}$/ // 한글 2 - 10자리
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/ //알파벳 대소문자 하나 이상 숫자중 하나 이상 6자리 이상

    if (!userid) {
      setUserIdError('아이디를 입력해주세요.')
      isValid = false
    } else if (!useridRegex.test(userid)) {
      setUserIdError('아이디는 알파벳과 숫자로 이루어진 4~12자여야 합니다.')
      isValid = false
    } else {
      setUserIdError('')
    }

    if (!username) {
      setNameError('이름을 입력해주세요.')
      isValid = false
    } else if (!nameRegex.test(username)) {
      setNameError('이름은 알파벳으로 이루어진 2~10자여야 합니다.')
      isValid = false
    } else {
      setNameError('')
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.')
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        '비밀번호는 최소 6자 이상이어야 하며, 영문자와 숫자가 모두 포함되어야 합니다.'
      )
      isValid = false
    } else {
      setPasswordError('')
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.')
      isValid = false
    } else {
      setConfirmPasswordError('')
    }

    if (isValid) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD')
      const formData = new FormData()
      formData.append('userid', userid)
      formData.append('username', username)
      formData.append('password', password)
      formData.append('birthday', formattedDate)
      formData.append('image', imagePreview, file)

      try {
        const response = await addUsers(formData)
        console.log('formdata : ', response)
        navigate('/')

      } catch (error) {
        console.error('addUsers Error : ', error)
      }
    }
  }


  return (
    <Container>
      <SignUpForm
        encType="multipart/form-data"
        method='post'
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <FileUploadContainer>
          <ImagePreview src={imagePreview} alt="Preview" />
          <input type="file" accept="image/*" onChange={ImageUploadHandler} />
        </FileUploadContainer>

        <IdContainer>
          <TextField
            id="userid"
            label="아이디"
            variant="standard"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            error={!!userIdError}
            helperText={userIdError}
            sx={{
              width: '235px',
              margin: '20px',
            }}
          />
          <Button variant="contained" onClick={DuplicateCheck}
            sx={{
              width: '90px',
              height: '50px',
            }}
          >
            중복검사
          </Button>
        </IdContainer>

        <TextField
          id="name"
          label="이름"
          variant="standard"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          sx={{
            width: '300px',
            margin: '20px',
          }}
        />
        <TextField
          id="password"
          label="비밀번호"
          variant="standard"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          sx={{
            width: '300px',
            margin: '20px',
          }}
        />
        <TextField
          id="confirm-password"
          label="비밀번호 확인"
          variant="standard"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          sx={{
            width: '300px',
            margin: '20px',
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="생년월일"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </DemoContainer>
        </LocalizationProvider>


        <Button variant="contained" onClick={SignUpClick}
          sx={{
            width: '300px',
            marginTop: '30px',
          }}
        >
          가입하기
        </Button>
      </SignUpForm>
    </Container>
  )
}


export default Signup


const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 400px;
  width: 100%;
`

const FileUploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 20px;
`

const ImagePreview = styled.img`
  width: 200px;
  height: 200px;
  margin-top: 10px;
  border-radius: 50%;
  border: 1px solid black;
`

const IdContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
`