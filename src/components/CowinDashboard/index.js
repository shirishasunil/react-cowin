import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusContent = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationData: {},
    apiStatus: apiStatusContent.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusContent.inProgress,
    })
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachData => ({
          vaccineDate: eachData.vaccine_date,
          dose1: eachData.dose_1,
          dose2: eachData.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(eachGender => ({
          count: eachGender.count,
          age: eachGender.age,
        })),
      }
      console.log(updatedData)
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusContent.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContent.failure})
    }
  }

  renderSuccessView = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-view-image"
      />
      <h1 className="failure-heading ">Something Went Wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div testid="loader" className="loading-view">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusContent.success:
        return this.renderSuccessView()
      case apiStatusContent.failure:
        return this.renderFailureView()
      case apiStatusContent.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="app-container">
          <div className="responsive-container">
            <div className="co-win-container">
              <img
                alt="website logo"
                src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
                className="website-logo"
              />
              <h1 className="logo-heading">co-WIN</h1>
            </div>
            <h1 className="heading">CoWIN Vaccination in India</h1>
            <div className="api-success-container">
              {this.renderViewsBasedOnAPIStatus()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default CowinDashboard
