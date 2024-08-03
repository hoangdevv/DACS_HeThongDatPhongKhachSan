package com.project.hethongkhachsan.entity;

import javax.persistence.Table;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;

@Entity
@Table(name = "payment_methodsT")
public class PaymentMethodEntity extends BaseEntity{

	@Column
	private String name;
	
	@Column
	private String description;
	
	@OneToMany(mappedBy = "payment_method", cascade = CascadeType.ALL)
	private List<PaymentEntity> payments  = new ArrayList<>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<PaymentEntity> getPayments() {
		return payments;
	}

	public void setPayments(List<PaymentEntity> payments) {
		this.payments = payments;
	}
	
}
