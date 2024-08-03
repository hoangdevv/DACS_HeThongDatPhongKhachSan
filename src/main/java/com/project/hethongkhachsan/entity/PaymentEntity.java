package com.project.hethongkhachsan.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "paymentsT")
public class PaymentEntity extends BaseEntity{
	
	@ManyToOne()
	@JoinColumn(name = "booking_id")
	private BookingEntity booking;

	@Column
	private Double amount;
	
	@Column
	private Date paymentDate;
	
	@ManyToOne()
	@JoinColumn(name = "payment_method_id")
	private PaymentMethodEntity payment_method;


	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public Date getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(Date paymentDate) {
		this.paymentDate = paymentDate;
	}

	public BookingEntity getBooking() {
		return booking;
	}

	public void setBooking(BookingEntity booking) {
		this.booking = booking;
	}

	public PaymentMethodEntity getPayment_method() {
		return payment_method;
	}

	public void setPayment_method(PaymentMethodEntity payment_method) {
		this.payment_method = payment_method;
	}
	 
}
