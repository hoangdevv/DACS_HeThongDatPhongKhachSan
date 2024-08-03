import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBed,
  cilBell,
  cilBuilding,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Bảng điều khiển',
    to: 'dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Khách sạn',
    to: 'hotel',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Mục lục',
        to: 'index-hotels',
      },
     
    ],
  },
  {
    component: CNavGroup,
    name: 'Phòng',
    to: '/base',
    icon: <CIcon icon={cilBed} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Mục lục',
        to: 'index-hotels',
      },
      {
        component: CNavItem,
        name: 'Quản lý loại phòng',
        to: 'index-type',
      },
      {
        component: CNavItem,
        name: 'Quản lý tiện ích',
        to: 'index-amenity',
      },
    ],
  },
]

export default _nav