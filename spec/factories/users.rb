# Read about factories at https://github.com/thoughtbot/factory_girl
require 'faker'

FactoryGirl.define do
  factory :user do
    email Faker::Internet.email
    password Faker::Internet.password(8, 16)

    trait :admin do
      role :admin
    end

    trait :staff do
      role :staff
    end
  end
end
