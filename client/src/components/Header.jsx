import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const [showPublicationsMenu, setShowPublicationsMenu] = useState(false)
  const [showMembersMenu, setShowMembersMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const publicationsDropdownRef = useRef(null)
  const membersDropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const isActive = (path) => {
    return location.pathname === path
  }

  const handlePublicationsClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPublicationsMenu(!showPublicationsMenu)
    setShowMembersMenu(false) // 다른 드롭다운 닫기
  }

  const handleMembersClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMembersMenu(!showMembersMenu)
    setShowPublicationsMenu(false) // 다른 드롭다운 닫기
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
  }

  const closePublicationsMenu = () => {
    setShowPublicationsMenu(false)
  }

  const closeMembersMenu = () => {
    setShowMembersMenu(false)
  }

  // 페이지 이동 시 스크롤을 최상단으로 올리는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (publicationsDropdownRef.current && !publicationsDropdownRef.current.contains(event.target)) {
        setShowPublicationsMenu(false)
      }
      if (membersDropdownRef.current && !membersDropdownRef.current.contains(event.target)) {
        setShowMembersMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 모바일 메뉴 열림 시 body 스크롤 방지
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMobileMenu])

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo" onClick={scrollToTop}>
          DBI LAB.
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="header-nav">
        <Link 
          to="/research" 
          className={`nav-link ${isActive('/research') ? 'active' : ''}`}
          onClick={scrollToTop}
        >
          Research
        </Link>
        
        <div className="nav-dropdown" ref={publicationsDropdownRef}>
          <button 
            className={`nav-link dropdown-toggle ${isActive('/selected-publications') || isActive('/work-in-progress-publications') ? 'active' : ''}`}
            onClick={handlePublicationsClick}
            type="button"
          >
            Publications
          </button>
          
          {showPublicationsMenu && (
            <div className="dropdown-menu">
              <Link 
                to="/selected-publications" 
                className="dropdown-item"
                onClick={() => {
                  closePublicationsMenu()
                  scrollToTop()
                }}
              >
                Selected
              </Link>
              <Link 
                to="/work-in-progress-publications" 
                className="dropdown-item"
                onClick={() => {
                  closePublicationsMenu()
                  scrollToTop()
                }}
              >
                Work-in-Progress
              </Link>
            </div>
          )}
        </div>
        
        <div className="nav-dropdown" ref={membersDropdownRef}>
          <button
            className={`nav-link dropdown-toggle ${isActive('/professor') || isActive('/researchers') || isActive('/students') || isActive('/alumni') ? 'active' : ''}`}
            onClick={handleMembersClick}
            type="button"
          >
            Members
          </button>
          
          {showMembersMenu && (
            <div className="dropdown-menu">
              <Link 
                to="/professor" 
                className="dropdown-item"
                onClick={() => {
                  closeMembersMenu()
                  scrollToTop()
                }}
              >
                Professor
              </Link>
              <Link 
                to="/researchers" 
                className="dropdown-item"
                onClick={() => {
                  closeMembersMenu()
                  scrollToTop()
                }}
              >
                Researchers
              </Link>
              <Link
                to="/students"
                className="dropdown-item"
                onClick={() => {
                  closeMembersMenu()
                  scrollToTop()
                }}
              >
                Students
              </Link>
              <Link
                to="/alumni"
                className="dropdown-item"
                onClick={() => {
                  closeMembersMenu()
                  scrollToTop()
                }}
              >
                Alumni
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/projects" 
          className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
          onClick={scrollToTop}
        >
          Projects
        </Link>
        
        <Link 
          to="/courses" 
          className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
          onClick={scrollToTop}
        >
          Courses
        </Link>
        
        <Link 
          to="/news" 
          className={`nav-link ${isActive('/news') ? 'active' : ''}`}
          onClick={scrollToTop}
        >
          News
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      {!showMobileMenu && (
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && ReactDOM.createPortal(
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content" ref={mobileMenuRef}>
            <div className="mobile-menu-header">
              <button className="mobile-menu-close" onClick={closeMobileMenu}>
                ×
              </button>
            </div>
            
            <nav className="mobile-menu-nav">
              <Link 
                to="/research" 
                className={`mobile-nav-link ${isActive('/research') ? 'active' : ''}`}
                onClick={() => {
                  closeMobileMenu()
                  scrollToTop()
                }}
              >
                Research
              </Link>
              
              <div className="mobile-menu-section">
                <h4>Publications</h4>
                <Link 
                  to="/selected-publications" 
                  className="mobile-nav-link"
                  onClick={() => {
                    closeMobileMenu()
                    scrollToTop()
                  }}
                >
                  Selected
                </Link>
                <Link 
                  to="/work-in-progress-publications" 
                  className="mobile-nav-link"
                  onClick={() => {
                    closeMobileMenu()
                    scrollToTop()
                  }}
                >
                  Work-in-Progress
                </Link>
              </div>
              
              <div className="mobile-menu-section">
                <h4>Members</h4>
                <Link 
                  to="/professor" 
                  className="mobile-nav-link"
                  onClick={() => {
                    closeMobileMenu()
                    scrollToTop()
                  }}
                >
                  Professor
                </Link>
                <Link 
                  to="/researchers" 
                  className="mobile-nav-link"
                  onClick={() => {
                    closeMobileMenu()
                    scrollToTop()
                  }}
                >
                  Researchers
                </Link>
                <Link
                  to="/students"
                  className="mobile-nav-link"
                  onClick={() => {
                    closeMobileMenu()
                    scrollToTop()
                  }}
                >
                  Students
                </Link>
                <Link
                  to="/alumni"
                  className="mobile-nav-link"
                  onClick={() => {
                    closeMobileMenu()
                    scrollToTop()
                  }}
                >
                  Alumni
                </Link>
              </div>

              <Link
                to="/projects" 
                className={`mobile-nav-link ${isActive('/projects') ? 'active' : ''}`}
                onClick={() => {
                  closeMobileMenu()
                  scrollToTop()
                }}
              >
                Projects
              </Link>
              
              <Link 
                to="/courses" 
                className={`mobile-nav-link ${isActive('/courses') ? 'active' : ''}`}
                onClick={() => {
                  closeMobileMenu()
                  scrollToTop()
                }}
              >
                Courses
              </Link>
              
              <Link 
                to="/news" 
                className={`mobile-nav-link ${isActive('/news') ? 'active' : ''}`}
                onClick={() => {
                  closeMobileMenu()
                  scrollToTop()
                }}
              >
                News
              </Link>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </header>
  )
}